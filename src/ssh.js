const { NodeSSH } = require('node-ssh')
const chalk = require('chalk')

async function SSH(host, username, privateKey, password) {
  const ssh = new NodeSSH()

  if (password) {
    try {
      await ssh.connect({
        host: host,
        port: 22,
        username: username,
        password: password
      })
    } catch (error) {
      if (error.message === "All configured authentication methods failed") {
        console.log(`${chalk.red('[ERROR]')} Invalid username or password`)
        return
      } else if (error.message === "Timed out while waiting for handshake") {
        console.log(`${chalk.red('[ERROR]')} Timed out while waiting for handshake`)
        return
      }
    }
  } else {
    try {
      await ssh.connect({
        host: host,
        port: 22,
        username: username,
        privateKey: privateKey
      })
    } catch (error) {
      if (error.message === "All configured authentication methods failed") {
        console.log(`${chalk.red('[ERROR]')} Invalid private key`)
        return
      }
    }
  }

  const pipeStream = stream => {
    const { stdin, stdout, stderr } = process
    const { isTTY } = stdout

    if (isTTY && stdin.setRawMode) stdin.setRawMode(true)

    stream.pipe(stdout)
    stream.stderr.pipe(stderr)
    stdin.pipe(stream)

    const onResize =
      isTTY && (() => stream.setWindow(stdout.rows, stdout.columns, null, null))
    if (isTTY) {
      stream.once('data', onResize)
      process.stdout.on('resize', onResize)
    }
    stream.on('close', () => {
      if (isTTY) process.stdout.removeListener('resize', onResize)
      stream.unpipe()
      stream.stderr.unpipe()
      stdin.unpipe()
      if (stdin.setRawMode) stdin.setRawMode(false)
      stdin.unref()
    })
  }

  await new Promise((resolve, reject) => {
    ssh.connection.shell({ term: process.env.TERM || 'vt100' }, (err, stream) => {
      if (err) {
        reject(err)
        return
      }
      pipeStream(stream)
      stream.on('close', () => resolve(true))
    })
  })

  ssh.dispose()
}

module.exports = SSH;