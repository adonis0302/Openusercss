import test from 'ava'
import Nightmare from 'nightmare'

const clientOptions = {
  'waitTimeout':      7000,
  'gotoTimeout':      7000,
  'loadTimeout':      7000,
  'executionTimeout': 13000,
  'show':             !process.env.CI,
}

export const client = new Nightmare(clientOptions)
export const appURL = 'http://dev.openusercss.local'
export const resolution = [1366, 768,]

test.before((t) => {
  return client
  .viewport(...resolution)
  .goto(appURL)
  .wait('.ouc-app-root')
})

test.after.always((t) => {
  return client.end()
})

export default test
