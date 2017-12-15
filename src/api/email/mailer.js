import Email from 'email-templates'
import nodemailer from 'nodemailer'
import pify from 'pify'
import path from 'path'

export const createTestAccount = async () => {
  const testAccount = await pify(nodemailer.createTestAccount)

  return testAccount()
}

export const createTransport = async (transportOpts) => {
  return pify(nodemailer.createTransport)(transportOpts)
}

export const sendEmail = async (transport, {to, template, locals}) => {
  const resourcePath = path.resolve('./static')
  const email = new Email({
    'juice':          true,
    'juiceResources': {
      'preserveImportant': false,
      'webResources':      {
        'relativeTo': resourcePath
      }
    },
    'message': {
      'from': 'notifications@openusercss.org'
    },
    transport
  })

  return email.send({
    to,
    template,
    locals
  })
}
