import test from 'ava'
import Nightmare from 'nightmare'
import hat from 'hat'
import {load as loadEnv,} from 'dotenv'
import smtp from 'smtp-tester'
// import log from 'chalk-console'

const clientOptions = {
  'waitTimeout':      7000,
  'gotoTimeout':      7000,
  'loadTimeout':      7000,
  'executionTimeout': 13000,
  'typeInterval':     65,
  'show':             !process.env.CI,
}

export const {'parsed': env,} = loadEnv({
  'path': '.env.local',
})
export const client = new Nightmare(clientOptions)
export const appURL = 'http://dev.openusercss.local'
export const resolution = [1366, 768,]
export const username = hat(64)
export const password = hat(64)
export const email = `${env.TEST_MAIL_USER}+${username}@${env.TEST_MAIL_DOMAIN}`

let mailServer = null

test.before('Start fake mail server', (t) => {
  mailServer = smtp.init(2525)
})

test.before((t) => {
  return client
  .viewport(...resolution)
  .goto(appURL)
  .wait('.ouc-app-root')
})

test.beforeEach('Setup test context', (t) => {
  t.context.smtp = mailServer
  t.context.env = env
})

test.after.always('Close fake mail server and Electron client', (t) => {
  mailServer.stop()
  return client.end()
})

export default test
