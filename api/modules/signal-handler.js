import log from 'chalk-console'
import assert from 'assert'

export default ({thread, cleanup, name,}) => {
  assert(typeof name === 'string', `'name' must be a string, got ${typeof name}`)
  assert(typeof cleanup === 'function', `'cleanup' must be a function, got ${typeof cleanup}`)
  assert(typeof thread === 'object', `'thread' must be an object, got ${typeof thread}`)

  const noProcessMessage = "'thread' must be a process object"

  assert(typeof thread.on === 'function', noProcessMessage)
  assert(typeof thread.exit === 'function', noProcessMessage)
  assert(typeof thread.arch === 'string', noProcessMessage)
  assert(typeof thread.pid === 'number', noProcessMessage)

  thread.on('unhandledRejection', (error) => {
    log.error(`Unhandled promise rejection in ${name}: ${error.message}`)
    log.error(error.stack)
    thread.exit(1)
  })

  thread.on('SIGTERM', () => {
    log.info(`${name} received SIGTERM`)
    cleanup()
    thread.exit(15)
  })

  thread.on('SIGINT', () => {
    log.info(`${name} received SIGINT`)
    cleanup()
    thread.exit(2)
  })

  thread.on('exit', () => {
    log.info(`${name} process exiting immediately`)
  })
}
