const { Command, flags } = require('@oclif/command')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const spawn = require('child_process').spawn
const Get = require('../get')

class ConnectCommand extends Command {
    async run() {
        const { flags } = this.parse(ConnectCommand)

        var instancesFile = path.join(this.config.dataDir, 'instances.json')
        var instancesData = JSON.parse(fs.readFileSync(instancesFile))

        var configFile = path.join(this.config.configDir, 'config.json')
        var configData = JSON.parse(fs.readFileSync(configFile))

        var instanceToConnect = undefined

        if (flags.index) {
            instanceToConnect = instancesData[flags.index]
        } else if (flags.name) {
            var instanceIndex = -1
            instancesData.map((instance, index) => {
                if (instance['Name'] == flags.name) {
                    instanceIndex = index
                }
            })
            instanceToConnect = instancesData[instanceIndex]
        } else if (flags.address) {
            var instanceIndex = -1
            instancesData.map((instance, index) => {
                if (instance['Address'] == flags.address) {
                    instanceIndex = index
                }
            })
            instanceToConnect = instancesData[instanceIndex]
        }

        if (instanceToConnect == undefined) {
            console.log(`${chalk.red('[ERROR]')} Invalid selection`)
        } else if (instanceToConnect['Accessible'] == false) {
            console.log(`${chalk.red('[ERROR]')} Instance is not accessible`)
        } else {
            var username

            if (flags.username) {
                username = flags.username
            } else {
                username = instanceToConnect['Username']
            }

            var directory

            if (flags.directory) {
                directory = flags.directory
            } else {
                directory = '~/' + configData['pem Directory']
            }

            var key

            if (flags.key) {
                key = flags.key
            } else {
                key = instanceToConnect['Key Pair'] + '.pem'
            }

            console.log(`${chalk.green('[INFO]')} Connecting to "${instanceToConnect['Name']}" as "${username}" at "${instanceToConnect['Address']}:22"`)
            console.log(`${chalk.green('[INFO]')} If these details are incorrect, execute "aep list" and try again`)
            console.log(`${chalk.green('[INFO]')} Attempting to connect...`)

            const pythonProcess = spawn('python', [path.join(this.config.configDir, 'ssh.py'), directory, key, username, instanceToConnect['Address']])

            pythonProcess.stdout.on('data', function(data) {
                if (data) {
                    console.log(`${chalk.red('[ERROR]')} Failed to connect via SSH. To resolve, execute: "aep list" and try again`)
                    console.log(`${chalk.red('[REASON]')} ${data.toString()}`)
                }
            })
        }
    }
}

ConnectCommand.description = `Connect using SSH to an EC2 instance
Connect to an EC2 instance using either the instance index, name or address.\nAbility to override username and/or pem directory
`

ConnectCommand.flags = {
    index: flags.string({ char: 'i', description: 'Instance index' }),
    name: flags.string({ char: 'n', description: 'Instance name' }),
    address: flags.string({ char: 'a', description: 'Instance Address' }),
    username: flags.string({ char: 'u', description: 'Override connection username' }),
    directory: flags.string({ char: 'd', description: 'Override pem file directory' }),
    key: flags.string({ char: 'k', description: 'Override pem file name' })
}

module.exports = ConnectCommand
