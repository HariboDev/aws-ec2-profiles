const Table = require('cli-table')
const chalk = require('chalk')
const ConfigureCommand = require('./commands/configure')

async function Configure() {
    // await ConfigureCommand.run()

    const table = new Table({
        head: [
            chalk.green('Wagwan!\nThanks for downloading @haribodev/aws-ec2-profiles\nRun \'aep accounts add\' to register an AWS account\nwith the CLI or \'aep servers add\' to register a\nself managed server with the CLI!')
        ]
    })

    console.log()
    console.log(table.toString())
    console.log()
}

Configure()