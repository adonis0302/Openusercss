import Email from 'email-templates'
import nodemailer from 'nodemailer'
import pify from 'pify'
import path from 'path'

export const createTestAccount = async () => {
  const testAccount = await pify(nodemailer.createTestAccount)

  return testAccount()
}

export const verifyConnection = (transport) => {
  return new Promise((resolve, reject) => {
    transport.verify((error, success) => {
      if (error) {
        reject(error)
      } else if (!success) {
        reject(`Success is not truthy: ${JSON.stringify(success, null, 4)}`)
      } else {
        resolve(success)
      }
    })
  })
}

export const createTransport = async (transportOpts) => {
  const transport = nodemailer.createTransport(transportOpts)

  await verifyConnection(transport)
  return transport
}

export const createTestTransport = async () => {
  const account = await createTestAccount()
  const transport = nodemailer.createTransport({
    'host':   account.smtp.host,
    'port':   account.smtp.port,
    'secure': account.smtp.secure,
    'auth':   {
      'user': account.user,
      'pass': account.pass
    }
  })

  await verifyConnection(transport)
  return transport
}

export const sendEmail = async (transport, {to, template, locals}) => {
  const resourcePath = path.resolve('./static')
  const email = new Email({
    'juice':          true,
    'juiceResources': {
      'preserveImportant': true,
      'webResources':      {
        'relativeTo': resourcePath
      }
    },
    'send':    true,
    'message': {
      'from': 'notifications@openusercss.org'
    },
    transport
  })

  return email.send({
    template,
    locals,
    'message': {
      to
    }
  })
}
