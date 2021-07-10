const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const publicIp = require('public-ip')

function Get(flags, config) {
    return new Promise(async (resolve, reject) => {
        var instancesData = []
        var configData = {}

        try {
            configData = JSON.parse(fs.readFileSync(path.join(config.configDir, 'config.json')))
            console.log(`${chalk.green('[INFO]')} Config file located`)
        } catch (error) {
            reject(error)
        }

        if (!("accountCredentials" in configData)) {
            console.log(`${chalk.red('[ERROR]')} No accounts registered`)
            console.log(`${chalk.red('[REMEDY]')} Execute 'aep accounts add' to register a new account`)
            return
        }

        if (flags.region == 'all') {
            flags.region = ['us-east-1', 'us-east-2', 'us-west-1',
                'us-west-2', 'ap-south-1',
                'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1',
                'ap-southeast-2', 'ca-central-1', 'eu-central-1',
                'eu-west-1', 'eu-west-2', 'eu-west-3',
                'eu-north-1', 'sa-east-1'
            ]
        }

        var params = {}

        if (flags.state == 'all') {
            params = {
                Filters: [{
                    Name: 'instance-state-name',
                    Values: ['pending', 'running', 'stopping', 'shutting-down', 'stopped', 'terminated']
                }]
            }
        } else {
            params = {
                Filters: [{
                    Name: 'instance-state-name',
                    Values: flags.state
                }]
            }
        }

        for (let account of configData.accountCredentials) {
            console.log(`${chalk.green('[INFO]')} Checking account: ${account.awsAccountName}`)

            for (let region of flags.region) {
                console.log(`${chalk.green('[INFO]')} Checking region: ${region}`)

                var ec2 = new AWS.EC2({
                    accessKeyId: account.awsAccessKey,
                    secretAccessKey: account.awsSecretAccessKey,
                    region: region
                })

                try {
                    await ec2.describeInstances(params).promise()
                        .then(async data => {
                            await Promise.all(data.Reservations.map(async (instance, index) => {
                                var name
                                var username
                                var isAccessible

                                await ec2.describeImages({ ImageIds: [instance.Instances[0].ImageId] }).promise()
                                    .then(data => {
                                        if (data.Images[0].PlatformDetails.includes("Linux")) {
                                            if (data.Images[0].ImageLocation.includes("ubuntu")) {
                                                username = "ubuntu"
                                            } else if (data.Images[0].ImageLocation.includes("CentOS")) {
                                                username = "centos"
                                            } else {
                                                username = "ec2-user"
                                            }
                                        } else {
                                            username = "Administrator"
                                        }
                                    })
                                    .catch(err => {
                                        return err
                                    })


                                await Promise.all(instance.Instances[0].SecurityGroups.map(async securityGroup => {
                                    await ec2.describeSecurityGroups({ GroupIds: [securityGroup.GroupId] }).promise()
                                        .then(async data => {
                                            await Promise.all(data.SecurityGroups[0].IpPermissions.map(async ipPerms => {
                                                if (ipPerms.IpProtocol == "-1" || ipPerms.FromPort == 22 || ipPerms.ToPort == 22) {
                                                    var ipAddress

                                                    try {
                                                        ipAddress = await publicIp.v4()
                                                    } catch (error) {
                                                        reject(error)
                                                    }

                                                    if (ipPerms.IpRanges[0].CidrIp == ipAddress + "/32" || ipPerms.IpRanges[0].CidrIp == "0.0.0.0/0") {
                                                        if (instance.Instances[0].State.Name !== 'running') {
                                                            isAccessible = false
                                                        } else {
                                                            isAccessible = true
                                                        }
                                                    } else {
                                                        if (isAccessible !== true) {
                                                            isAccessible = false
                                                        }
                                                    }
                                                } else {
                                                    if (isAccessible !== true) {
                                                        isAccessible = false
                                                    }
                                                }
                                            }))
                                        })
                                        .catch(err => {
                                            reject(err)
                                        })
                                }))

                                try {
                                    name = instance.Instances[0].Tags[0].Value
                                } catch (error) {
                                    name = "N/A"
                                }

                                instancesData.push({
                                    'Name': name || "N/A",
                                    'Address': instance.Instances[0].PublicIpAddress || 'N/A',
                                    'Key Pair': instance.Instances[0].KeyName || "N/A",
                                    'Username': username || "N/A",
                                    'State': instance.Instances[0].State.Name || "N/A",
                                    'Accessible': isAccessible || false,
                                    'Region': region,
                                    'Account': account.awsAccountName
                                })

                            }))

                        })
                        .catch(err => {
                            reject(err)
                        })
                } catch (error) {
                    reject(error)
                }
            }

        }

        try {
            fs.writeFileSync(path.join(config.dataDir, 'instances.json'), JSON.stringify(instancesData))
            console.log(`${chalk.green('[INFO]')} EC2 instances gathered`)
            resolve(instancesData)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to save EC2 instance data locally`)
            reject(error)
        }
    })
}

module.exports = Get