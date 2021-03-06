const { Command, flags } = require('@oclif/command')
const Table = require('cli-table')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { cli } = require('cli-ux')

class AccountsCommand extends Command {
    async run() {
        const { args, flags } = this.parse(AccountsCommand)

        var configData

        try {
            configData = JSON.parse(fs.readFileSync(path.join(this.config.configDir, 'config.json')))
            console.log(`${chalk.green('[INFO]')} Config file located`)
            if (!("accountCredentials" in configData)) configData.accountCredentials = []
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to locate config file`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }

        if (args.action == "add") {
            var newAccount = {
                awsAccountName: await cli.prompt('AWS Account Name'),
                awsAccessKey: await cli.prompt('AWS Access Key'),
                awsSecretAccessKey: await cli.prompt('AWS Secret Access Key', { type: 'mask' })
            }

            if (await cli.confirm('Do you need to assume a role? [y/n]')) {
                newAccount['awsRole'] = await cli.prompt('Role ARN', { required: true })
            }

            configData.accountCredentials.push(newAccount)

            try {
                fs.writeFileSync(path.join(this.config.configDir, 'config.json'), JSON.stringify(configData))
                console.log(`${chalk.green('[INFO]')} Successfully saved config data`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to save config file`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        } else if (args.action == "remove") {

            var getIndex = async () => {
                var index = await cli.prompt('Account index to remove')

                try {
                    if (Number.isInteger(Number(index)) && index > -1 && index < configData.accountCredentials.length) {
                        return index
                    } else {
                        console.log(`${chalk.red('[ERROR]')} Invalid index`)
                        return await getIndex()
                    }
                } catch (error) {
                    console.log(`${chalk.red('[ERROR]')} Invalid index`)
                    return await getIndex()
                }

            }

            configData.accountCredentials.splice(await getIndex(), 1)

            try {
                fs.writeFileSync(path.join(this.config.configDir, 'config.json'), JSON.stringify(configData))
                console.log(`${chalk.green('[INFO]')} Successfully saved config data`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to save config file`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        } else if (args.action == "edit") {
            var getIndex = async () => {
                var index = await cli.prompt('Account index to edit')

                try {
                    if (Number.isInteger(Number(index)) && index > -1 && index < configData.accountCredentials.length) {
                        return index
                    } else {
                        console.log(`${chalk.red('[ERROR]')} Invalid index`)
                        return await getIndex()
                    }
                } catch (error) {
                    console.log(`${chalk.red('[ERROR]')} Invalid index`)
                    return await getIndex()
                }

            }

            var index = await getIndex()

            configData.accountCredentials[index].awsAccountName = await cli.prompt(`AWS Account Name [${configData.accountCredentials[index].awsAccountName}]`, { required: false }) || configData.accountCredentials[index].awsAccountName
            configData.accountCredentials[index].awsAccessKey = await cli.prompt(`AWS Access Key [${configData.accountCredentials[index].awsAccessKey}]`, { required: false }) || configData.accountCredentials[index].awsAccessKey

            var secret = configData.accountCredentials[index].awsSecretAccessKey

            if (flags.detail) {
                configData.accountCredentials[index].awsSecretAccessKey = await cli.prompt(`AWS Secret Access Key [${secret}]`, { required: false, type: 'mask' }) || secret
            } else {
                var mask = secret.substring(0, secret.length - 4).replace(/./g, "*")
                var lastFour = secret.substring(secret.length - 4, secret.length)
                configData.accountCredentials[index].awsSecretAccessKey = await cli.prompt(`AWS Secret Access Key [${mask + lastFour}]`, { required: false, type: 'mask' }) || secret
            }

            if (await cli.confirm('Do you need to assume a role? [y/n]')) {
                var role = await cli.prompt(`Role ARN [${configData.accountCredentials[index]["awsRole"] || 'None'}]`, { required: false }) || configData.accountCredentials[index]["awsRole"] || "None"

                if (role && role.toLowerCase() !== "none") {
                    configData.accountCredentials[index]["awsRole"] = role
                }
            } else {
                if ("awsRole" in configData.accountCredentials[index]) {
                    delete configData.accountCredentials[index]["awsRole"]
                }
            }

            try {
                fs.writeFileSync(path.join(this.config.configDir, 'config.json'), JSON.stringify(configData))
                console.log(`${chalk.green('[INFO]')} Successfully saved config data`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to save config file`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }

        }

        var table = new Table({
            head: [
                chalk.blueBright('Index'),
                chalk.blueBright('Account Name'),
                chalk.blueBright('Access Key'),
                chalk.blueBright('Secret Access Key'),
                chalk.blueBright('Role ARN')
            ]
        })

        configData.accountCredentials.map((account, index) => {
            table.push([
                index,
                account['awsAccountName'],
                account['awsAccessKey']
            ])

            var secret = account['awsSecretAccessKey']

            if (flags.detail) {
                table[index].push(secret)
            } else {
                var mask = secret.substring(0, secret.length - 4).replace(/./g, "*")
                var lastFour = secret.substring(secret.length - 4, secret.length)
                table[index].push(mask + lastFour)
            }

            if (account['awsRole']) {
                table[index].push(`${chalk.white(account['awsRole'])}`)
            } else {
                table[index].push(`${chalk.grey('N/A')}`)
            }
        })

        console.log(table.toString())
    }
}

AccountsCommand.description = `Display registered AWS accounts
Display registered AWS accounts
`

AccountsCommand.flags = {
    detail: flags.boolean({
        char: 'd',
        description: 'Show extra account details',
        default: false,
    })
}

AccountsCommand.args = [
    {
        name: 'action',
        description: 'Add, remove or edit an account',
        options: [
            'add',
            'remove',
            'edit'
        ]
    }
]

module.exports = AccountsCommand
