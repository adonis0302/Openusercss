import test from 'ava'
import Nightmare from 'nightmare'
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
    .goto('http://localhost:5010')
    .wait('.ouc-app-root')
  } catch (error) {
    log.error(error.stack)
  }

  return result
})

test.serial('contains correct text', async (t) => {
  await client.wait('.footer')
  const footerContent = await client.evaluate(() => {
    return document.querySelector('.footer').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/footer:contains-correct-text.png'))
  t.truthy(footerContent.match(/Copyright&nbsp;©/g))
  t.truthy(footerContent.match(/forums.openusercss.org\/topic\/5\/privacy-policy.*Privacy policy/g))
  t.true(footerContent.includes('GitHub'))
  t.true(footerContent.includes('Contact the administrator'))
})
