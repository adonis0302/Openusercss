import test, {client, appURL,} from '../helpers/end-to-end'
import hat from 'hat'
import path from 'path'

test.serial('updates URL', async (t) => {
  const randomValue = hat()

  const url = await client
  .goto(`${appURL}/search`)
  .insert('input[name="search"]', null)
  .type('input[name="search"]', randomValue)
  .evaluate(() => location.href)

  t.is(url, `${appURL}/search?terms=${randomValue}`)
  await client.screenshot(path.resolve('screenshots/test/end-to-end/search:updates-url.png'))
})

test.serial('input is URI encoded', async (t) => {
  const url = await client
  .insert('input[name="search"]', null)
  .type('input[name="search"]', 'hello world')
  .evaluate(() => location.href)

  t.is(url, `${appURL}/search?terms=hello%20world`)
  await client.screenshot(path.resolve('screenshots/test/end-to-end/search:input-is-URI-encoded.png'))
})
