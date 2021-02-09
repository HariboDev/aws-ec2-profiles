const { Command, flags } = require('@oclif/command')
const path = require('path')
const chalk = require('chalk')
const Check = require('../check')
const AWS = require('aws-sdk')
const fs = require('fs')

class UpdateCommand extends Command {
  async run() {
    const { flags } = this.parse(UpdateCommand)
    console.log(flags)

    if ("force" in flags) {
      if (flags.force.length === 2) {
        console.log(`${chalk.green('[INFO]')} Force changing IP`)
        console.log(`${chalk.green('[INFO]')} From: ${flags.force[0]}`)
        console.log(`${chalk.green('[INFO]')} To: ${flags.force[1]}`)

        try {
          var configData = JSON.parse(fs.readFileSync(path.join(this.config.configDir, 'config.json')))

          for (let account of configData.accountCredentials) {
            console.log(`${chalk.green('[INFO]')} Checking account: ${account.awsAccountName}`)

            if (flags.region == 'all') {
              var regions = ['us-east-1', 'us-east-2', 'us-west-1',
                'us-west-2', 'ap-south-1',
                'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1',
                'ap-southeast-2', 'ca-central-1', 'eu-central-1',
                'eu-west-1', 'eu-west-2', 'eu-west-3',
                'eu-north-1', 'sa-east-1']

              for (let region of regions) {
                await this.checkRegion(region, flags.force[0], flags.force[1], account)
              }
            } else {
              for (let region of flags.region) {
                await this.checkRegion(region, flags.force[0], flags.force[1], account)
              }
            }
          }
        } catch (error) {
          console.log(`${chalk.red('[ERROR]')} Unable to read config file`)
          console.log(`${chalk.red('[REASON]')} ${error}`)
          return
        }

      } else {
        console.log(`${chalk.red('[ERROR]')} Invalid arguments supplied to --force flag`)
        console.log(`${chalk.red('[USAGE]')} aep update --force FROM_IP TO_IP`)
      }
    } else {
      Check(path.join(this.config.dataDir, 'data.json'))
        .then(async response => {
          if (response.changed) {
            console.log(`${chalk.green('[INFO]')} IP change detected`)
            console.log(`${chalk.green('[INFO]')} Old IP: ${response.oldIP}`)
            console.log(`${chalk.green('[INFO]')} Current IP: ${response.currentIP}`)

            try {
              var configData = JSON.parse(fs.readFileSync(path.join(this.config.configDir, 'config.json')))

              for (let account of configData.accountCredentials) {
                console.log(`${chalk.green('[INFO]')} Checking account: ${account.awsAccountName}`)

                if (flags.region == 'all') {
                  var regions = ['us-east-1', 'us-east-2', 'us-west-1',
                    'us-west-2', 'ap-south-1',
                    'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1',
                    'ap-southeast-2', 'ca-central-1', 'eu-central-1',
                    'eu-west-1', 'eu-west-2', 'eu-west-3',
                    'eu-north-1', 'sa-east-1']

                  for (let region of regions) {
                    await this.checkRegion(region, response.oldIP, response.currentIP, account)
                  }
                } else {
                  for (let region of flags.region) {
                    await this.checkRegion(region, response.oldIP, response.currentIP, account)
                  }
                }
              }
            } catch (error) {
              console.log(`${chalk.red('[ERROR]')} Unable to read config file`)
              console.log(`${chalk.red('[REASON]')} ${error}`)
              return
            }

          } else {
            console.log(`${chalk.green('[INFO]')} No IP change detected`)
            console.log(`${chalk.green('[INFO]')} Current IP: ${response.currentIP}`)
          }
        })
        .catch(error => {
          console.log(`${chalk.red('[ERROR]')} ${error.errorSummary}`)
          console.log(`${chalk.red('[REASON]')} ${error.errorMessage}`)
          return
        })
    }
  }

  async checkRegion(region, oldIP, currentIP, account) {
    console.log(`${chalk.green('[INFO]')} Checking region: ${region}`)

    var ec2 = new AWS.EC2({
      accessKeyId: account.awsAccessKey,
      secretAccessKey: account.awsSecretAccessKey,
      region: region
    })

    await ec2.describeSecurityGroups().promise()
      .then(async data => {

        if (data.length == 0) {
          console.log(`${chalk.green('[INFO]')} No security groups found`)
        } else {
          var relevantRule = false

          for (let securityGroup of data.SecurityGroups) {
            for (let ipPerms of securityGroup.IpPermissions) {
              for (let ranges of ipPerms.IpRanges) {
                if (ranges.CidrIp == oldIP + "/32") {
                  await this.addRuleToSecurityGroup(ec2, oldIP, currentIP, securityGroup.GroupId, ipPerms)
                  relevantRule = true
                }
              }
            }
          }

          if (!relevantRule) {
            console.log(`${chalk.green('[INFO]')} No relevant ingress rules to change`)
          }

        }

      })
      .catch(error => {
        console.log(`${chalk.red('[ERROR]')} Unable to describe security groups`)
        console.log(`${chalk.red('[REASON]')} ${error}`)
        return
      })
  }

  async addRuleToSecurityGroup(ec2, oldIP, currentIP, groupId, ipPerms) {
    var params = {
      GroupId: groupId,
      IpPermissions: [
        {
          FromPort: ipPerms.FromPort,
          IpProtocol: ipPerms.IpProtocol,
          IpRanges: [
            {
              CidrIp: currentIP + '/32'
            }
          ],
          ToPort: ipPerms.ToPort
        }
      ]
    }

    await ec2.authorizeSecurityGroupIngress(params).promise()
      .then(async () => {
        console.log(`${chalk.green('[INFO]')} Successfully added new security group ingress rule`)
        await this.deleteRuleFromSecurityGroup(ec2, oldIP, groupId, ipPerms)
      })
      .catch(error => {
        console.log(`${chalk.red('[ERROR]')} Unable to add new security group ingress rule`)
        console.log(`${chalk.red('[REASON]')} ${error}`)
        return
      })
  }

  async deleteRuleFromSecurityGroup(ec2, oldIP, groupId, ipPerms) {
    var params = {
      GroupId: groupId,
      IpPermissions: [
        {
          FromPort: ipPerms.FromPort,
          IpProtocol: ipPerms.IpProtocol,
          IpRanges: [
            {
              CidrIp: oldIP + '/32'
            }
          ],
          ToPort: ipPerms.ToPort
        }
      ]
    }

    await ec2.revokeSecurityGroupIngress(params).promise()
      .then(() => {
        console.log(`${chalk.green('[INFO]')} Successfully deleted old security group ingress rule`)
      })
      .catch(error => {
        console.log(`${chalk.red('[ERROR]')} Unable to delete old security group ingress rule`)
        console.log(`${chalk.red('[REASON]')} ${error}`)
        return
      })
  }
}

UpdateCommand.description = `Update security groups with your new public IP
Checks if your public IP has changed and updates relevant AWS security groups
`

UpdateCommand.flags = {
  region: flags.string({
    char: 'r',
    description: 'Only update security groups in a specific region(s)',
    required: false,
    multiple: true,
    default: 'all',
    options: [
      'us-east-1',
      'us-east-2',
      'us-west-1',
      'us-west-2',
      'ap-south-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-southeast-1',
      'ap-southeast-2',
      'ca-central-1',
      'eu-central-1',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'eu-north-1',
      'sa-east-1'
    ]
  }),
  force: flags.string({
    char: 'f',
    description: 'Force change of a rule from one IP to another. This doesn\'t have to be your IP',
    required: false,
    multiple: true
  })
}

module.exports = UpdateCommand
