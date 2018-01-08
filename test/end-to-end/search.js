import hat from 'hat'
import test from 'ava'
import {remote,} from 'webdriverio'

const client = remote({
  'desiredCapabilities': {
    'browserName': 'chrome',
  },
})

test.before(async (t) => {
  return client.init()
  .setViewportSize({
    'width':  1280,
    'height': 720,
  })
  .url('http://localhost:5010/search')
  .waitForVisible('.ouc-app-root')
})

test.after.always(async (t) => {
  return client.end()
})

test.after.always(async (t) => {
  return client.end()
})

test.serial('updates URL', async (t) => {
  const randomValue = hat()

  await client.setValue('input[name="search"]', randomValue)
  const url = await client.getUrl()

  t.true(url === `http://localhost:5010/search/${randomValue}`)
})

test.serial('input is URI encoded', async (t) => {
  await client.setValue('input[name="search"]', 'hello world')
  const url = await client.getUrl()

  t.true(url === 'http://localhost:5010/search/hello%20world')
})
