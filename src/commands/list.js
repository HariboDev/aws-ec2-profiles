const { Command, flags } = require('@oclif/command')
const Table = require('cli-table')
const chalk = require('chalk')
const Get = require('../get')

class ListCommand extends Command {
    async run() {
        const { flags } = this.parse(ListCommand)

        var instancesData

        try {
            instancesData = await Get(flags, this.config)
        } catch (error) {
            console.log(`${chalk.red('[REASON]')} ${error}`)
            return
        }

        var table = new Table({
            head: [
                chalk.blueBright('Index'),
                chalk.blueBright('Name'),
                chalk.blueBright('Address'),
                chalk.blueBright("Key Pair"),
                chalk.blueBright("Username"),
                chalk.blueBright('State'),
                chalk.blueBright('Accessible'),
                chalk.blueBright('Location'),
                chalk.blueBright('Account'),
                chalk.blueBright('Managed By')
            ]
        })

        var managementChoice = []

        if (flags.managed === 'all') {
            managementChoice.push('awsManaged')
            managementChoice.push('selfManaged')
        } else {
            if (flags.managed.includes('aws')) {
                managementChoice.push('awsManaged')
            }

            if (flags.managed.includes('self')) {
                managementChoice.push('selfManaged')
            }
        }

        managementChoice.map(managed => {
            instancesData[managed].map((instance, index) => {
                table.push([
                    (managed === "awsManaged" ? index : index + instancesData["awsManaged"].length),
                    (instance['Name'] == "N/A" ?
                        chalk.grey(`${instance['Name']}`)
                        :
                        chalk.white(`${instance['Name']}`)
                    ),
                    (instance['Address'] == "N/A" ?
                        chalk.grey(`${instance['Address']}`)
                        :
                        chalk.white(`${instance['Address']}`)
                    ),
                    (instance['Key Pair'] == "N/A" ?
                        chalk.grey(`${instance['Key Pair']}`)
                        :
                        chalk.white(`${instance['Key Pair']}`)
                    ),
                    (instance['Username'] == "N/A" ?
                        chalk.grey(`${instance['Username']}`)
                        :
                        chalk.white(`${instance['Username']}`)
                    ),
                    (instance['State'] == 'running' ?
                        chalk.green(`${instance['State']}`)
                        :
                        (instance['State'] == 'stopping' || instance['State'] == 'pending' ?
                            chalk.yellow(`${instance['State']}`)
                            :
                            (instance['State'] == 'unknown' ?
                                chalk.grey(`${instance['State']}`)
                                :
                                chalk.red(`${instance['State']}`)
                            )
                        )
                    ),
                    (instance['Accessible'] == true ?
                        chalk.green(`${instance['Accessible']}`)
                        :
                        (instance['Accessible'] == false ?
                            chalk.red(`${instance['Accessible']}`)
                            :
                            chalk.white(`${instance['Accessible']}`)
                        )
                    ),
                    (instance['Location'] == 'N/A' ?
                        chalk.grey(`${instance['Location']}`)
                        :
                        chalk.white(`${instance['Location']}`)
                    ),
                    (instance['Account'] == 'N/A' ?
                        chalk.grey(`${instance['Account']}`)
                        :
                        chalk.white(`${instance['Account']}`)
                    ),
                    (managed == "awsManaged" ?
                        chalk.white(`AWS`)
                        :
                        chalk.white(`Self`)
                    )
                ])
            })
        })

        console.log(table.toString())
    }
}

ListCommand.description = `Display EC2 instances
Gathers up to date EC2 instance data and displays summaries in a table
`

ListCommand.flags = {
    region: flags.string({
        char: 'r',
        description: 'Only get instances in a specific region(s)',
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
    state: flags.string({
        char: 's',
        description: 'Only get instances of in a specific state(s)',
        multiple: true,
        default: 'all',
        options: [
            'pending',
            'running',
            'stopping',
            'stopped',
            'shutting-down',
            'terminated'
        ]
    }),
    account: flags.string({
        char: 'a',
        description: 'Only get instances from a specific account(s)',
        multiple: true,
        default: 'all'
    }),
    managed: flags.string({
        char: 'm',
        description: 'Only get instances under a specific management(s)',
        multiple: true,
        default: 'all',
        options: [
            'aws',
            'self'
        ]
    })
}

module.exports = ListCommand
