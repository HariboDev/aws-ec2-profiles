const { Command } = require('@oclif/command')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs');
const chalk = require('chalk')
const { cli } = require('cli-ux')
const publicIp = require('public-ip')

class ConfigureCommand extends Command {
    async run() {
        if (await this.createDirectories()) {
            await this.createConfigFile()
            await this.createDataFile()
            await this.createScripts()
        }
    }

    async createDirectories() {
        if (!fs.existsSync(this.config.configDir)) {
            try {
                shell.mkdir('-p', this.config.configDir)
                console.log(`${chalk.green('[INFO]')} Package directory created successfully`)
                return true
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to create package directory`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return false
            }
        }
    }

    async createConfigFile() {
        var configData = {}

        if (fs.existsSync(this.config.configDir)) {
            console.log(`${chalk.green('[INFO]')} Config directory located`)
        } else {
            try {
                shell.mkdir('-p', this.config.configDir)
                console.log(`${chalk.green('[INFO]')} Config directory created successfully`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to create config directory`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        }

        if (fs.existsSync(path.join(this.config.configDir, 'config.json'))) {
            try {
                console.log(`${chalk.green('[INFO]')} Config file located`)
                configData = JSON.parse(fs.readFileSync(path.join(this.config.configDir, 'config.json')))
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to read config file`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        }

        var newConfigData = {}

        newConfigData['pem Directory'] = await cli.prompt('Default .pem directory [Downloads]', { required: false }) || 'Downloads'

        var accountCredentials = []

        var addAccount = async () => {
            accountCredentials.push({
                awsAccountName: await cli.prompt('AWS Account Name'),
                awsAccessKey: await cli.prompt('AWS Access Key'),
                awsSecretAccessKey: await cli.prompt('AWS Secret Access Key', { type: 'mask' })
            })

            var addAnotherAccount = await cli.confirm('Would you like to add another account [y/n]')

            if (addAnotherAccount) {
                await addAccount()
            }
        }

        await addAccount()

        newConfigData.accountCredentials = accountCredentials

        try {
            fs.writeFileSync(path.join(this.config.configDir, 'config.json'), JSON.stringify(newConfigData))
            console.log(`${chalk.green('[INFO]')} Successfully saved config data`)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to save config file`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }
    }

    async createDataFile() {
        if (fs.existsSync(this.config.dataDir)) {
            console.log(`${chalk.green('[INFO]')} Data directory located`)
        } else {
            try {
                shell.mkdir('-p', this.config.dataDir)
                console.log(`${chalk.green('[INFO]')} Data directory created successfully`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to create data directory`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        }

        var publicIP

        try {
            publicIP = await publicIp.v4()
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to get public IP`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }

        var dataData = {
            IP: publicIP
        }

        try {
            fs.writeFileSync(path.join(this.config.dataDir, 'data.json'), JSON.stringify(dataData))
            console.log(`${chalk.green('[INFO]')} Successfully saved data to data file`)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to save data to data file`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }
    }

    async createScripts() {
        var pythonFile = path.join(this.config.configDir, 'ssh.py')
        var pythonScript = `import subprocess\nimport sys\n\ntry:\n   subprocess.call("start ssh -i " + sys.argv[1] + "/" + sys.argv[2] + ".pem " + sys.argv[3] + "@" + sys.argv[4] + "", shell=True)\nexcept Exception as e:\n   print(e)`

        try {
            fs.writeFileSync(pythonFile, pythonScript)
            console.log(`${chalk.green('[INFO]')} Successfully created ssh script`)
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to create ssh script`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }
    }
}

ConfigureCommand.description = `Configure the CLI
Add accounts and customise the CLI tool
`

module.exports = ConfigureCommand
