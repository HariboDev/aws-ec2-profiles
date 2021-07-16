const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const publicIp = require('public-ip')
const isPortReachable = require('is-port-reachable');

function Get(flags, config) {
    return new Promise(async (resolve, reject) => {
        var instancesData = {
            awsManaged: [],
            selfManaged: []
        }
        var configData = {}

        try {
            configData = JSON.parse(fs.readFileSync(path.join(config.configDir, 'config.json')))
            console.log(`${chalk.green('[INFO]')} Config file located`)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to locate config file`)
            reject(error)
            return
        }

        try {
            selfManagedInstances = JSON.parse(fs.readFileSync(path.join(config.dataDir, 'instances.json'))).selfManaged || []
            console.log(`${chalk.green('[INFO]')} Data file located`)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to locate data file`)
            reject(error)
            return
        }

        if (("accountCredentials" in configData)) {
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

            if (flags.managed === 'all' || flags.managed.includes('aws')) {
                for (let account of configData.accountCredentials) {
                    if (flags.account === "all") {
                        console.log(`${chalk.green('[INFO]')} Checking account: ${account.awsAccountName}`)
                    } else {
                        if (flags.account.includes(account.awsAccountName)) {
                            console.log(`${chalk.green('[INFO]')} Checking account: ${account.awsAccountName}`)
                        } else {
                            console.log(`${chalk.yellow('[INFO]')} Skipping account: ${account.awsAccountName}`)
                            continue
                        }
                    }

                    for (let region of flags.region) {
                        console.log(`${chalk.green('[INFO]')} Checking region: ${region}`)

                        var roleCredentials

                        if ("awsRole" in account) {
                            var stsParams = {
                                RoleArn: account.awsRole,
                                RoleSessionName: "aws-ec2-profiles"
                            }

                            var sts = new AWS.STS({
                                accessKeyId: account.accessKeyId,
                                secretAccessKey: account.secretAccessKey,
                                region: region
                            })
                            roleCredentials = await sts.assumeRole(stsParams, (err, data) => {
                                if (err) {
                                    console.log(err)
                                    return
                                } else {
                                    return data
                                }
                            }).promise()

                            if (!roleCredentials) {
                                console.log(`${chalk.red('ERROR')} Unable to get role credentials for ${region}`)
                                continue
                            }
                        }

                        if ("awsRole" in account && roleCredentials) {
                            var ec2 = new AWS.EC2({
                                accessKeyId: roleCredentials.Credentials.AccessKeyId,
                                secretAccessKey: roleCredentials.Credentials.SecretAccessKey,
                                sessionToken: roleCredentials.Credentials.SessionToken,
                                region: region,
                            })
                        } else {
                            var ec2 = new AWS.EC2({
                                accessKeyId: account.awsAccessKey,
                                secretAccessKey: account.awsSecretAccessKey,
                                region: region
                            })
                        }

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

                                        instancesData.awsManaged.push({
                                            'Name': name || "N/A",
                                            'Address': instance.Instances[0].PublicIpAddress || 'N/A',
                                            'Key Pair': instance.Instances[0].KeyName || "N/A",
                                            'Username': username || "N/A",
                                            'State': instance.Instances[0].State.Name || "N/A",
                                            'Accessible': isAccessible || false,
                                            'Location': region,
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
            }
        }


        await Promise.all(selfManagedInstances.map(async instance => {
            var instanceData = {
                'Name': instance['Name'],
                'Address': instance['Address'],
                'Key Pair': instance['Key Pair'],
                'Username': instance['Username'],
                'State': instance['State'],
                'Accessible': instance['State'],
                'Location': instance['Location'],
                'Account': instance['Account']
            }

            instanceData.Accessible = await isPortReachable(22, { host: instance.Address })

            instancesData.selfManaged.push(instanceData)
        }))

        try {
            fs.writeFileSync(path.join(config.dataDir, 'instances.json'), JSON.stringify(instancesData))
            console.log(`${chalk.green('[INFO]')} Instances gathered`)
            resolve(instancesData)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to save instance data locally`)
            reject(error)
        }
    })
}

module.exports = Get