/* eslint no-process-env:0 */

import 'babel-polyfill'

import log from 'chalk-console'
import path from 'path'
import {forOwn} from 'lodash'
import {spawn} from 'child_process'

log.info('Manager process starting')

const startList = {
  'API':       path.resolve(process.mainModule.paths[0], '../api/index'),
  'Webserver': path.resolve(process.mainModule.paths[0], '../webserver/index')
}

const startProcesses = (list) => {
  const started = []

  forOwn(list, async (value, key) => {
    log.info(`Manager starting ${key}`)
    const child = spawn('node', [
      value
    ], {
      'stdio': 'inherit',
      'env':   process.env
    })

    child.name = key
    started.push(child)
  })

  return started
}

const stopProcesses = (processes) => {
  const stopped = []

  forOwn(processes, async (child, key) => {
    log.info(`Manager stopping ${child.name}`)
    child.kill('SIGTERM')
    stopped.push(child)
  })

  return stopped
}

const children = startProcesses(startList)

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
