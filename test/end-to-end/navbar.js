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

test.serial('contains items text', async (t) => {
  const navbar = await client.evaluate(() => {
    return document.querySelector('.navbar').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/navbar:contains-items-text.png'))
  t.true(navbar.includes('Home'))
  t.true(navbar.includes('Log in'))
  t.true(navbar.includes('Register'))
  t.true(navbar.includes('Search'))
  t.true(navbar.includes('Forums'))
})

test.serial('visits /login', async (t) => {
  await client.click('.navbar a[href="/login"]')
  await client.wait('.ouc-login-form')
  const loginForm = await client.evaluate(() => {
    return document.querySelector('.ouc-login-form').innerHTML
  })
  const loginButton = await client.evaluate(() => {
    return document.querySelector('.ouc-login-form .button').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/navbar:visits-login.png'))
  t.true(loginForm.includes('Log in to OpenUserCSS'))
  t.true(loginButton.includes('Login'))
})

test.serial('visits /register', async (t) => {
  await client.click('.navbar a[href="/register"]')
  await client.wait('.ouc-register-form')
  const registerForm = await client.evaluate(() => {
    return document.querySelector('.ouc-register-form').innerHTML
  })
  const registerButton = await client.evaluate(() => {
    return document.querySelector('.ouc-register-form .button').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/navbar:visits-register.png'))
  t.true(registerForm.includes('Create your OpenUserCSS account'))
  t.true(registerButton.includes('Register'))
})

test.serial('visits /search', async (t) => {
  await client.click('.navbar a[href="/search"]')
  await client.wait('input[name="search"]')
  const searchInput = await client.evaluate(() => {
    return document.querySelector('.ouc-search-field').innerHTML
  })

  await client.screenshot(path.resolve('screenshots/test/end-to-end/navbar:visits-search.png'))
  t.true(searchInput.includes('placeholder="Search themes and users"'))
})

test.serial('goes to forums', async (t) => {
  await client.click('.navbar a[href="//forums.openusercss.org"]')
  await client.wait('a.navigation-link[href="//openusercss.org"]')
  const url = await client.evaluate(() => location.href)

  await client.screenshot(path.resolve('screenshots/test/end-to-end/navbar:goes-to-forums.png'))
  t.is(url, 'https://forums.openusercss.org/')
})
