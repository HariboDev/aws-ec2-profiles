@haribodev/aws-ec2-profiles
================

[![Version](https://img.shields.io/npm/v/@haribodev/aws-ec2-profiles.svg)](https://www.npmjs.com/package/@haribodev/aws-ec2-profiles)
[![Downloads/week](https://img.shields.io/npm/dw/@haribodev/aws-ec2-profiles.svg)](https://www.npmjs.com/package/@haribodev/aws-ec2-profiles)
[![License](https://img.shields.io/npm/l/@haribodev/aws-ec2-profiles.svg)](https://github.com/HariboDev/aws-ec2-profiles/blob/master/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g @haribodev/aws-ec2-profiles
$ aep COMMAND
running command...
$ aep (-v|--version|version)
@haribodev/aws-ec2-profiles/1.3.6 win32-x64 node-v12.16.3
$ aep --help [COMMAND]
USAGE
  $ aep COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`aep accounts [ACTION]`](#aep-accounts-action)
* [`aep configure`](#aep-configure)
* [`aep connect`](#aep-connect)
* [`aep help [COMMAND]`](#aep-help-command)
* [`aep list`](#aep-list)
* [`aep update`](#aep-update)

## `aep accounts [ACTION]`

Display registered AWS accounts

```
USAGE
  $ aep accounts [ACTION]

ARGUMENTS
  ACTION  (add|remove|edit) Add, remove or modify an account

OPTIONS
  -d, --detail  Show extra account details

DESCRIPTION
  Display registered AWS accounts
```

_See code: [src\commands\accounts.js](https://github.com/HariboDev/aws-ec2-profiles/blob/v1.3.6/src\commands\accounts.js)_

## `aep configure`

Configure the CLI

```
USAGE
  $ aep configure

DESCRIPTION
  Add accounts and customise the CLI tool. This command should be used after package updates.
```

_See code: [src\commands\configure.js](https://github.com/HariboDev/aws-ec2-profiles/blob/v1.3.6/src\commands\configure.js)_

## `aep connect`

Connect using SSH to an EC2 instance

```
USAGE
  $ aep connect

OPTIONS
  -a, --address=address      Instance Address
  -d, --directory=directory  Override pem file directory
  -i, --index=index          Instance index
  -k, --key=key              Override pem file name
  -n, --name=name            Instance name
  -u, --username=username    Override connection username

DESCRIPTION
  Connect to an EC2 instance using either the instance index, name or address.
  Ability to override username and/or pem directory
```

_See code: [src\commands\connect.js](https://github.com/HariboDev/aws-ec2-profiles/blob/v1.3.6/src\commands\connect.js)_

## `aep help [COMMAND]`

display help for aep

```
USAGE
  $ aep help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src\commands\help.ts)_

## `aep list`

Display EC2 instances

```
USAGE
  $ aep list

OPTIONS
  -a, --account=account
      [default: all] Only get instances from a specific account(s)

  -d, --detail
      Show extra instance details

  -r, 
  --region=us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|ap-southeast-1|ap-southeast-
  2|ca-central-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-north-1|sa-east-1
      [default: all] Only get instances in a specific region(s)

  -s, --state=pending|running|stopping|stopped|shutting-down|terminated
      [default: all] Only get instances of in a specific state(s)

DESCRIPTION
  Gathers up to date EC2 instance data and displays summaries in a table
```

_See code: [src\commands\list.js](https://github.com/HariboDev/aws-ec2-profiles/blob/v1.3.6/src\commands\list.js)_

## `aep update`

Update security groups with your new public IP

```
USAGE
  $ aep update

OPTIONS
  -f, --force=force
      Force change of a rule from one IP to another. This doesn't have to be your IP

  -r, 
  --region=us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|ap-southeast-1|ap-southeast-
  2|ca-central-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-north-1|sa-east-1
      [default: all] Only update security groups in a specific region(s)

DESCRIPTION
  Checks if your public IP has changed and updates relevant AWS security groups
```

_See code: [src\commands\update.js](https://github.com/HariboDev/aws-ec2-profiles/blob/v1.3.6/src\commands\update.js)_
<!-- commandsstop -->
