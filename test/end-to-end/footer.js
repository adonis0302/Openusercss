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
  .url('http://localhost:5010')
  .waitForVisible('.ouc-app-root')
})

test.after.always(async (t) => {
  return client.end()
})

test.serial('footer contains correct text', async (t) => {
  await client.waitForVisible('.footer')
  const footerContent = await client.getText('.footer')

  t.true(footerContent.includes('Copyright © 2018 DecentM and Contributors'))
  t.true(footerContent.includes('Privacy policy | Terms of service | Notice'))
  t.true(footerContent.includes('GitHub'))
  t.true(footerContent.includes('Contact the administrator'))
})
