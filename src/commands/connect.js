const { Command, flags } = require('@oclif/command')
const fs = require('fs')
const path = require('path')
const { cli } = require('cli-ux')
const chalk = require('chalk')
const SSH = require('../ssh')

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

            if (flags.password) {
                var password = await cli.prompt(`Enter password for ${username}@${instanceToConnect['Address']}:22`, { required: true, type: 'hide' })
            } else {
                var directory

                if (flags.directory) {
                    directory = flags.directory
                } else {
                    directory = '~/' + configData['pem Directory']
                }

                var key

                if (flags.key) {
                    key = await this.resolveHome(directory + "/" + flags.key)
                } else {
                    key = await this.resolveHome(directory + "/" + instanceToConnect['Key Pair'])
                }
            }

            console.log('')
            console.log(`${chalk.green('[INFO]')} Connecting to "${instanceToConnect['Name']}" as "${username}" at "${instanceToConnect['Address']}:22"`)
            console.log(`${chalk.green('[INFO]')} If these details are incorrect, execute "aep list" to update instance details and try again`)
            console.log(`${chalk.green('[INFO]')} Attempting to connect...`)
            console.log('')

            await SSH(instanceToConnect['Address'], username, key, password)
        }
    }

    async resolveHome(filepath) {
        var validFileExtensions = [".pem", ".ppk"]

        if (filepath[0] === '~') {
            filepath = path.join(process.env.HOME, filepath.slice(1));
        }

        if (validFileExtensions.includes(filepath.slice(-4))) {
            if (fs.existsSync(filepath)) {
                console.log(filepath)
                return filepath
            }
        } else {
            for (var extension of validFileExtensions) {
                if (fs.existsSync(filepath + extension)) {
                    return filepath + extension
                }
            }
        }

        console.log(`${chalk.red('[ERROR]')} Could not find key file: ${filepath}`)
        process.exit()
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
    key: flags.string({ char: 'k', description: 'Override pem file name' }),
    password: flags.boolean({ char: 'p', description: 'Ask for password' })
}

module.exports = ConnectCommand
