/* eslint no-process-env:0 */

import Conf from 'conf'
import hat from 'hat'
import log from 'chalk-console'
import cp from 'node-cp'
import pify from 'pify'
import path from 'path'
// import keypair from 'keypair'
import selfsigned from 'selfsigned'

const inProd = () => {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  return true
}

let defaultConfig = null

if (inProd()) {
  defaultConfig = {
    'env':   'production',
    'ports': {
      'http':  80,
      'https': 443
    },
    'domain':     'openusercss.org',
    'saltRounds': 15,
    'database':   {
      'main':  'mongodb://localhost:27017/openusercss-main',
      'brute': 'mongodb://localhost:27017/openusercss-brute'
    }
  }
} else {
  log.warn('App in development mode, configuration is set to low security!')

  defaultConfig = {
    'env':   'development',
    'ports': {
      'http':  8080,
      'https': 8443
    },
    'domain':     'openusercss.org',
    'saltRounds': 11,
    'database':   {
      'main':  'mongodb://localhost:27017/openusercss-main',
      'brute': 'mongodb://localhost:27017/openusercss-brute'
    }
  }
}

const genKeypair = async () => {
  log.warn('A new keypair is being generated. All users will be logged out when the app starts.')

  const generationStart = Date.now()
  let pem = null

  if (inProd()) {
    pem = selfsigned.generate(null, {
      'keySize':    4096,
      'algorithm':  'sha256',
      'extensions': [
        {'name': 'basicConstraints'}
      ],
      'clientCertificate':   true,
      'clientCertificateCN': '*'
    })
  } else {
    log.warn('App in development mode, the new keypair is very weak!')
    pem = selfsigned.generate(null, {
      'keySize':    512,
      'algorithm':  'sha256',
      'extensions': [
        {'name': 'basicConstraints'}
      ],
      'clientCertificate':   true,
      'clientCertificateCN': '*'
    })
  }

  log.info(`Keypair generated in ${Date.now() - generationStart}ms`)
  return pem
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
