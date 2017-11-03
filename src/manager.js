/* eslint no-process-env:0 */

import 'babel-polyfill'

import log from 'chalk-console'
import path from 'path'
import {forOwn} from 'lodash'
import respawn from 'respawn'

log.info('Manager process starting')

const basePath = path.resolve(process.mainModule.paths[0], '..')
const startList = {
  'API':       path.join(basePath, '/api'),
  'Webserver': path.join(basePath, '/webserver')
}

const startProcesses = (list) => {
  const started = []

  forOwn(list, async (value, key) => {
    log.info(`Manager starting ${key}`)
    const child = respawn(['node', value], {
      'name':        key,
      'env':         process.env,
      'cwd':         basePath,
      'maxRestarts': 10,
      'sleep':       250,
      'kill':        30000,
      'stdio':       'inherit',
      'fork':        false
    })

    child.start()
    started.push(child)
  })

  return started
}

const stopProcesses = (processes) => {
  const stopped = []

  forOwn(processes, async (child, key) => {
    log.info(`Manager stopping ${child.name}`)
    child.stop()
    stopped.push(child)
  })

  return stopped
}

const children = startProcesses(startList)

process.on('unhandledRejection', (error) => {
  log.error(`Unhandled promise rejection: ${error.message}`)
  process.exit(1)
})
process.on('SIGINT', () => {
  log.info('Manager received SIGINT')
  stopProcesses(children)
})
process.on('SIGTERM', () => {
  log.info('Manager received SIGTERM')
  stopProcesses(children)
})
process.on('exit', () => {
  log.info('Manager process exiting immediately')
})
