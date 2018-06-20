import test, {
  client,
  appURL,
  username,
  password,
  email,
} from '../lib/end-to-end'

const emailField = 'input[name="email"]'
const usernameField = 'input[name="displayname"]'
const passwordField = 'input[name="password"]'
const passwordVerifyField = 'input[name="passwordVerify"]'
const tosSwitch = 'input[name="terms"]'

const submit = 'button[type="submit"]'
const getErrors = () => document.querySelector('.error-bag').innerHTML

test.serial('Cannot register without e-mail', async (t) => {
  const error = await client
  .goto(`${appURL}/register`)
  .wait(emailField)
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The e-mail field is required'))
})
test.serial('Cannot register without correct e-mail format', async (t) => {
  const error = await client
  .type(emailField, 'a@a.a')
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The e-mail field must be a valid email'))

  await client
  .insert(emailField)
  .type(emailField, email)
})
test.serial('Cannot register without username', async (t) => {
  const error = await client
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The displayname field is required'))
})
test.serial('Cannot register with too long username', async (t) => {
  const error = await client
  .type(usernameField, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The displayname field may not be greater than 32 characters.'))

  await client
  .insert(usernameField)
  .type(usernameField, username)
})
test.serial('Cannot register without password', async (t) => {
  const error = await client
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The passphrase field is required'))
})
test.serial('Cannot register without password verification', async (t) => {
  const error = await client
  .type(passwordField, password)
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The passphrase verification field is required'))
})
test.serial('Cannot register without matching passwords', async (t) => {
  const error = await client
  .type(passwordVerifyField, 'a')
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('The passphrase verification confirmation does not match.'))

  await client
  .insert(passwordVerifyField)
  .type(passwordVerifyField, password)
})
test.serial('Cannot register without accepting TOS', async (t) => {
  const error = await client
  .click(submit)
  .evaluate(getErrors)

  t.true(error.includes('Please accept the terms of service before continuing'))
})

test.serial('Redirects to login once registration is complete', async (t) => {
  const error = await client
  .click(tosSwitch)
  .click(submit)
  .evaluate(getErrors)

  // The error bag is a Bulma notification with an ul in it
  // if no list items are present, no notification is shown
  t.false(error.includes('<li>'))

  const path = await client
  .wait('.ouc-login-form')
  .evaluate(() => location.pathname)

  t.is(path, '/login')
})
test.serial('Sends welcome e-mail correctly', async (t) => {
  const mailResult = await t.context.smtp.captureOne(email, {
    'wait': 10000,
  })

  t.true(mailResult.address === email)
  t.true(mailResult.email.sender === 'notifications@openusercss.org')
  t.true(mailResult.email.body.includes(username))
  t.true(mailResult.email.body.includes(`://${t.context.env.OUC_DOMAIN}/account/verify-email/`))
})

test.todo('Cannot log in without e-mail')
test.todo('Cannot log in without correct e-mail format')
test.todo('Cannot log in without the e-mail we used to register')
test.todo('Can log in without e-mail authentication')

test.todo('Redirects to index after logging in')
test.todo('Username appears in the navbar')
