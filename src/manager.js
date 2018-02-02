import 'babel-polyfill'

import log from 'chalk-console'
import path from 'path'
import {forOwn,} from 'lodash'
import respawn from 'respawn'
import staticConfig from './shared/config'

log.info('Manager process starting')

const basePath = path.resolve(process.mainModule.paths[0], '..')
const startList = {
  'API':       path.join(basePath, '/api'),
  'Webserver': path.join(basePath, '/webserver'),
}

const startProcesses = (list) => {
  const started = []

  forOwn(list, (value, key) => {
    log.info(`Manager starting ${key}`)
    const child = respawn([
      'node',
      value,
    ], {
      'name':        key,
      'env':         process.env,
      'cwd':         basePath,
      'maxRestarts': 10,
      'sleep':       500,
      'kill':        200,
      'stdio':       'inherit',
      'fork':        false,
    })

    child.start()
    started.push(child)
  })

  return started
}

const stopProcesses = (processes) => {
  const stops = Promise.all(processes.filter((child) => {
    return new Promise((resolve, reject) => {
      log.info(`Manager stopping ${child.name}`)
      child.stop(() => {
        log.info(`Manager stopped ${child.name}`)
        resolve()
      })
    })
  }))

  return stops
}

let children = null
const init = async () => {
  const config = await staticConfig()
  const configEnv = config.get('env')

  if (configEnv.toString() !== process.env.NODE_ENV.toString()) {
    log.error([
      'Environment error',
      `This instance of the application is configured for ${configEnv}.`,
      `The current environment is ${process.env.NODE_ENV}.`,
      'The current configuration must be reset in order to boot.',
    ].join('\n\t'))

    process.exit(1)
  }

  children = startProcesses(startList)
}

init()

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled promise rejection in Manager: ${error.message}`)
  log.error(error.stack)
  process.exit(1)
})

process.on('SIGTERM', () => {
  log.info('Manager received SIGTERM')
  stopProcesses(children)
})

process.on('SIGINT', () => {
  log.info('Manager received SIGINT')
  stopProcesses(children)
})

process.on('exit', () => {
  log.info('Manager process exiting immediately')
})
