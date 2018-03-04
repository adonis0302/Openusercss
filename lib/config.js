import Conf from 'conf'
import hat from 'hat'
import log from 'chalk-console'
import cp from 'node-cp'
import path from 'path'
import selfsigned from 'selfsigned'
import {
  defaultsDeep,
  forOwn,
  isEqual,
} from 'lodash'

if (process.env.NODE_ENV === 'test') {
  process.env.NODE_ENV = 'development'
}

const appPath = path.resolve(process.mainModule.paths[0], '..')
const defaultConfig = {
  'env':   process.env.NODE_ENV,
  'ports': {
    'api': {
      'https': 5001,
      'http':  5000,
    },
    'frontend': {
      'https': 5011,
      'http':  5010,
    },
  },
  'domain':     'openusercss.org',
  'saltrounds': 15,
  'database':   {
    'main': 'mongodb://localhost:27017/openusercss-main',
  },
  'sentry': {
    'webserver': '',
    'api':       '',
  },
  'mail': {
    'smtp': {
      'host':       'localhost',
      'port':       '25',
      'secure':     false,
      'requiretls': false,
    },
    'user': '',
    'pass': '',
  },
}

const genKeypair = () => {
  log.warn([
    `A new keypair is being generated for ${process.env.NODE_ENV}.`,
    'All users will be logged out when the app starts.',
  ].join('\n'))
  let pem = null

  if (process.env.NODE_ENV !== 'development') {
    pem = selfsigned.generate(null, {
      'keySize':    4096,
      'algorithm':  'sha256',
      'extensions': [
        {'name': 'basicConstraints',},
      ],
      'clientCertificate':   true,
      'clientCertificateCN': '*',
    })
  } else {
    pem = selfsigned.generate(null, {
      'keySize':    512,
      'algorithm':  'sha256',
      'extensions': [
        {'name': 'basicConstraints',},
      ],
      'clientCertificate':   true,
      'clientCertificateCN': '*',
    })
  }

  return pem
}

const initConfig = () => {
  /*
   * WARNING
   * While the configKey does encrypt the contents of our config.json,
   * it musn't be relied on for security, as said key is written to disk
   * in plain text, right next to the encrypted data.
   *
   * It's only useful for for checking config file integrity.
   *
   * Nevertheless, we can write our keys down, because we expect the
   * system administrator to properly secure the runtime environment.
   */

  const secretsConfig = new Conf({
    'cwd':         path.join(appPath, 'data'),
    'configName':  'secrets',
    'projectName': 'opensuercss.org',
  })
  const configKey = secretsConfig.get('configKey')
  const newVersion = `${Date.now()}.${hat(8)}`

  if (!configKey || !secretsConfig.get('version')) {
    cp(path.join(__dirname, 'secrets.json'), path.join(__dirname, `bkup.${newVersion}.secrets`))
    cp(path.join(__dirname, 'config.json'), path.join(__dirname, `bkup.${newVersion}.config`))

    log.warn([
      'Invalid config',
      'Unable to decrypt config.json, because our secrets.json is either missing or corrupt!',
      'Your configuration options have been reset to defaults',
      'A backup of your previous config has been made, just in case',
      'You can find your backups here:',
      path.join(appPath, `bkup.${newVersion}`),
    ].join('\n\t'))

    secretsConfig.set('configKey', hat(256))
    secretsConfig.set('version', newVersion)
  }

  const confOptions = {
    'configName': 'config',
    'cwd':        path.join(appPath, 'data'),
    'defaults':   defaultConfig,
  }

  if (process.env.NODE_ENV !== 'development') {
    confOptions.encryptionKey = secretsConfig.get('configKey')
  }

  const config = new Conf(confOptions)

  if (
    !config.get('version')
    || !config.get('keypair')
  ) {
    config.set('keypair', genKeypair())
    config.set('version', newVersion)
  }

  return config
}

const ourConfig = initConfig()
const finalizedConfig = defaultsDeep(ourConfig.get(), defaultConfig)

if (!isEqual(ourConfig.get(), finalizedConfig)) {
  log.warn([
    'Discrepancy in finalized configuration',
    'Resetting to new value',
  ].join('\n\t'))
  ourConfig.set(finalizedConfig)
}

forOwn(process.env, (envValue, envName) => {
  const valid = !!envName.match('_')

  if (valid) {
    const ours = envName.split('_')[0] === 'OUC'

    if (ours) {
      const nameArray = envName.toLowerCase().split('_')

      nameArray.splice(0, 1)

      if (ourConfig.get(nameArray.join('.')) !== envValue) {
        log.info(`Resetting configuration value for ${nameArray.join('.')} based on environment`)
        ourConfig.set(nameArray.join('.'), envValue)
      }
    }
  }
})

log.info([
  'Initialized configuration in',
  ourConfig.path,
].join('\n\t'))

export default async () => {
  return ourConfig
}
