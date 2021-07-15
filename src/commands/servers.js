const { Command } = require('@oclif/command')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { cli } = require('cli-ux')
const isPortReachable = require('is-port-reachable');

class ServersCommand extends Command {
    async run() {
        const { args } = this.parse(ServersCommand)

        try {
            var instancesFile = path.join(this.config.dataDir, 'instances.json')
            var instancesData = JSON.parse(fs.readFileSync(instancesFile))

            if (!("selfManaged" in instancesData)) {
                instancesData.selfManaged = []
            }

            if (!("awsManaged" in instancesData)) {
                instancesData.awsManaged = []
            }
        } catch (error) {
            console.log(`${chalk.red('[ERROR]')} Unable to locate data file`)
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }

        if (args.action === 'add') {
            var newInstance = {
                'Name': await cli.prompt('Server Name', { required: false }) || '',
                'Address': await cli.prompt('Server Address', { required: true }),
                'Key Pair': await cli.prompt('Key Pair Name [N/A]', { required: false }) || 'N/A',
                'Username': await cli.prompt('Username', { required: true }),
                'State': 'unknown',
                'Accessible': 'unknown',
                'Location': await cli.prompt('Server Location [N/A]', { required: false }) || 'N/A',
                'Account': 'N/A'
            }

            newInstance.Accessible = await isPortReachable(22, { host: newInstance.Address })

            instancesData.selfManaged.push(newInstance)

            try {
                fs.writeFileSync(path.join(this.config.dataDir, 'instances.json'), JSON.stringify(instancesData))
                console.log(`${chalk.green('[INFO]')} Successfully saved instances`)
            } catch (error) {
                console.log(`${chalk.red('[ERROR]')} Unable to save instances data`)
                console.log(`${chalk.red('[REASON]')} ${error}`)
                return
            }
        } else if (args.action === 'remove') {
            var address = await cli.prompt('Server address to remove', { required: true })
            var indexToEdit

            instancesData.selfManaged.map((instance, index) => {
                if (instance['Address'] === address) {
                    indexToEdit = index
                }
            })

            if (indexToEdit !== undefined) {
                instancesData.selfManaged.splice(indexToEdit, 1)

                try {
                    fs.writeFileSync(path.join(this.config.dataDir, 'instances.json'), JSON.stringify(instancesData))
                    console.log(`${chalk.green('[INFO]')} Successfully saved instances file`)
                } catch (error) {
                    console.log(`${chalk.red('[ERROR]')} Unable to save instances file`)
                    console.log(`${chalk.red('[REASON]')} ${error}`)
                    return
                }
            } else {
                console.log(`${chalk.red('[ERROR]')} Server with address ${address} not found`)
                return
            }
        } else if (args.action === "edit") {
            var address = await cli.prompt('Server address to edit', { required: true })
            var indexToEdit

            instancesData.selfManaged.map((instance, index) => {
                if (instance['Address'] === address) {
                    indexToEdit = index
                }
            })

            if (indexToEdit !== undefined) {
                var oldInstance = instancesData.selfManaged[indexToEdit]

                var newInstance = {
                    'Name': await cli.prompt(`Server Name [${oldInstance['Name']}]`, { required: false }) || oldInstance['Name'],
                    'Address': await cli.prompt(`Server Address [${oldInstance['Address']}]`, { required: false }) || oldInstance['Address'],
                    'Key Pair': await cli.prompt(`Key Pair Name [${oldInstance['Key Pair']}]`, { required: false }) || oldInstance['Key Pair'],
                    'Username': await cli.prompt(`Username [${oldInstance['Username']}]`, { required: false }) || oldInstance['Username'],
                    'State': oldInstance['State'],
                    'Accessible': oldInstance['Accessible'],
                    'Location': await cli.prompt(`Server Location [${oldInstance['Location']}]`, { required: false }) || oldInstance['Location'],
                    'Account': oldInstance['Account']
                }

                newInstance.Accessible = await isPortReachable(22, { host: newInstance.Address })

                instancesData.selfManaged[indexToEdit] = newInstance

                try {
                    fs.writeFileSync(path.join(this.config.dataDir, 'instances.json'), JSON.stringify(instancesData))
                    console.log(`${chalk.green('[INFO]')} Successfully saved instances file`)
                } catch (error) {
                    console.log(`${chalk.red('[ERROR]')} Unable to save instances file`)
                    console.log(`${chalk.red('[REASON]')} ${error}`)
                    return
                }
            } else {
                console.log(`${chalk.red('[ERROR]')} Server with address ${address} not found`)
                return
            }
        }
    }
}

ServersCommand.description = `Register and degregister self managed servers
Register and degregister self managed servers
`

ServersCommand.args = [
    {
        name: 'action',
        description: 'Add, remove or edit a self managed server',
        options: [
            'add',
            'remove',
            'edit'
        ]
    }
]

module.exports = ServersCommand