import test from 'ava'
import Nightmare from 'nightmare'
import hat from 'hat'
import path from 'path'
import log from 'chalk-console'

const clientOptions = {
  'waitTimeout':      7000,
  'gotoTimeout':      7000,
  'loadTimeout':      7000,
  'executionTimeout': 13000,
  'show':             !process.env.CI,
}

if (process.env.CI) {
  clientOptions.electronPath = path.resolve('node_modules/.bin/electron')
}

const client = new Nightmare(clientOptions)

test.before(async (t) => {
  let result = null

  try {
    result = client
    .viewport(1280, 720)
    .goto('http://localhost:5010/search')
    .wait('.ouc-app-root')
  } catch (error) {
    log.error(error.stack)
  }

  return result
})

test.serial('updates URL', async (t) => {
  const randomValue = hat()

  await client.insert('input[name="search"]', null)
  await client.type('input[name="search"]', randomValue)
  const url = await client.evaluate(() => location.href)

  await client.screenshot(path.resolve('screenshots/test/end-to-end/search:updates-url.png'))
  t.is(url, `http://localhost:5010/search/${randomValue}`)
})

test.serial('input is URI encoded', async (t) => {
  await client.insert('input[name="search"]', null)
  await client.type('input[name="search"]', 'hello world')
  const url = await client.evaluate(() => location.href)

  await client.screenshot(path.resolve('screenshots/test/end-to-end/search:input-is-URI-encoded.png'))
  t.is(url, 'http://localhost:5010/search/hello%20world')
})
