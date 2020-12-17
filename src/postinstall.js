const fs = require('fs')
const path = require('path')
const Table = require('cli-table')
const chalk = require('chalk')
const ConfigureCommand = require('./commands/configure')

async function Configure() {
    await ConfigureCommand.run()

    const table = new Table({
        head: [
            chalk.green('Wagwan!\nThanks for downloading @hlacannon/aws-ec2-profiles\nRun \'aep list\' to retrieve all EC2 instances!')
        ]
    })

    console.log()
    console.log(table.toString())
    console.log()
}

Configure()