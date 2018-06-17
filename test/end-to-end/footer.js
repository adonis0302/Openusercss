import test, {client,} from '../lib/end-to-end'
import path from 'path'

test.serial('contains correct text', async (t) => {
  const footerContent = await client
  .wait('.footer')
  .evaluate(() => {
    return document.querySelector('.footer').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/footer:contains-correct-text.png'))
  t.truthy(footerContent.match(/Copyright&nbsp;©/g))
  t.truthy(footerContent.match(/forums.openusercss.org\/topic\/5\/privacy-policy.*Privacy policy/g))
  t.true(footerContent.includes('GitHub'))
  t.true(footerContent.includes('Contact the administrator'))
})

test.serial('contains current year', async (t) => {
  const footerContent = await client
  .evaluate(() => {
    return document.querySelector('.footer').innerHTML
  })

  const year = new Date().getFullYear()

  t.true(footerContent.includes(`Copyright&nbsp;©&nbsp;${year}&nbsp;`))
})
