import test from 'ava'
import Nightmare from 'nightmare'
import path from 'path'

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
  return client
  .viewport(1280, 720)
  .goto('http://localhost:5010')
  .wait('.ouc-app-root')
})

test.serial('footer contains correct text', async (t) => {
  await client.wait('.footer')
  const footerContent = await client.evaluate(() => {
    return document.querySelector('.footer').innerHTML
  })

  t.truthy(footerContent.match(/Copyright&nbsp;©/g))
  t.truthy(footerContent.match(/<a href=\"\/\/forums.openusercss.org\/topic\/5\/privacy-policy\" data-v-[0-9,a-z]{8}=\"\">Privacy policy<\/a>/g))
  t.true(footerContent.includes('GitHub'))
  t.true(footerContent.includes('Contact the administrator'))
})
