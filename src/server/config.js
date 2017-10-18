import Conf from 'conf'
import hat from 'hat'
import log from 'chalk-console'
import cp from 'node-cp'
import pify from 'pify'
import path from 'path'
import keypair from 'keypair'

const inProd = () => {
  // eslint-disable-next-line
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  return true
}

const defaultConfig = {
  'port':       80,
  'domain':     'openusercss.org',
  'saltRounds': 15
}

if (inProd()) {
  defaultConfig.env = 'production'
} else {
  log.warn('App in development mode, salt rounds are set to 12!')
  defaultConfig.env = 'development'
  defaultConfig.saltRounds = 12
}

const genKeypair = async () => {
  log.warn('A new keypair is being generated. All users will be logged out when the app starts.')

  const generationStart = Date.now()
  let pair = null

  if (inProd()) {
    pair = keypair({
      'bits': 4096
    })
  } else {
    log.warn('App in development mode, the new keypair is very weak!')
    pair = keypair({
      'bits': 128
    })
  }

  log.info(`Keypair generated in ${Date.now() - generationStart}ms`)
  return pair
}

const initConfig = async () => {
  /*
   * WARNING
   * While the configKey does encrypt the contents of our config.json,
   * it musn't be relied on for security, as said key is written to disk
   * in plain text.
   *
   * It's only useful for deterring users from editing the file
   * and for checking integrity!
   *
   * Nevertheless, we can write our keys into it, because we expect the
   * system administrator to properly secure the runtime environment.
   */

  const secretsConfig = new Conf({
    'cwd':        __dirname,
    'configName': 'secrets'
  })
  const configKey = secretsConfig.get('configKey')
  const newVersion = `${Date.now()}.${hat(8)}`

  if (!secretsConfig.get('version')) {
    secretsConfig.set('version', newVersion)
  }
  if (!configKey) {
    await pify(cp)(path.join(__dirname, 'secrets.json'), path.join(__dirname, `bkup.${newVersion}.secrets`))
    await pify(cp)(path.join(__dirname, 'config.json'), path.join(__dirname, `bkup.${newVersion}.config`))

    log.error('Unable to decrypt config.json, because our secrets.json is either missing or corrupt!')
    log.warn('Your configuration options have been reset to defaults')
    log.warn('A backup of your previous config has been made, just in case')
    log.warn(`You can find your backups here:
  ${path.join(__dirname, `bkup.${newVersion}.(config name)`)}
    `)

    secretsConfig.set('configKey', hat(256))
    secretsConfig.set('version', newVersion)
  }

  const config = new Conf({
    'cwd':           __dirname,
    'configName':    'config',
    'encryptionKey': secretsConfig.get('configKey'),
    'defaults':      defaultConfig
  })

  if (!config.get('version')) {
    config.set('version', newVersion)
  }
  if (!config.get('keypair')) {
    config.set('keypair', await genKeypair())
  }

  return config
}

(async () => {
  const config = await initConfig()

  if (!inProd()) {
    log.info(`\n${config.get('keypair').private}`)
    log.info(`\n${config.get('keypair').public}`)
  }

  log.info(`Loaded configuration, version ${config.get('version')}`)
})()

export default initConfig
