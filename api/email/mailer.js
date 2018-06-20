import Email from 'email-templates'
import nodemailer from 'nodemailer'
import pify from 'pify'
import path from 'path'
import staticConfig from '../../lib/config'

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

const staticSignoffs = [
  'Shine like rainbows!',
  'See you soon on the Internet!',
  'The sky tonight is going to be crimson red!',
  'May the byte of bytes lead your way!',
  'Keep the code flowing!',
  'The only universal justice in this world is cuteness!',
  'Embrace your passion!',
  'Oh, no! My keyboarasnodnbau9dsnbc',
  '(1) update available. Contact local computer guy for details!',
  'Kawaii!',
  'H̀̀͢͝a̶̢͝͠v̸̵͟͝e͟͜ ̴͞͏a̴̢̨̕͡ ̷̸̸͟g҉̷ŗ̸̷̧͠e͟a̛͠t́͏̨ ̢d̶̡̕a͘̕͝͠y̵̶!̵̕͟͞',
  'html * {display: none !important}',
  'ɯɯɯɯɯɯɯɯɯɯɯɯɐʞᴉuoW ƃuᴉʞɔnℲ',
]

export const sendEmail = async ({to, template, locals,}) => {
  const config = await staticConfig()
  const auth = {
    'user': config.get('mail.user'),
    'pass': config.get('mail.pass'),
  }
  const transportOptions = {
    'host':       config.get('mail.smtp.host'),
    'port':       parseInt(config.get('mail.smtp.port'), 10),
    'secure':     config.get('mail.smtp.secure') === 'true',
    'requireTls': config.get('mail.smtp.requiretls') === 'true',
  }

  if (auth.user) {
    transportOptions.auth = auth
  }

  const transport = await createTransport(transportOptions)

  const signoffs = staticSignoffs.concat([
    `I'm ${process.uptime()} seconds old`,
    `Process ${process.pid} sends its regards!`,
  ])

  const resourcePath = path.resolve('./app/static')
  const email = new Email({
    'views': {
      'root': path.resolve('./build/emails'),
    },
    'juice':          true,
    'juiceResources': {
      'preserveImportant': true,
      'webResources':      {
        'relativeTo': resourcePath,
      },
    },
    'send':    true,
    'preview': false,
    'message': {
      'from': 'notifications@openusercss.org',
    },
    transport,
  })

  let domainUrl = `https://${config.get('domain')}`

  if (config.get('env') === 'development') {
    domainUrl = `http://${config.get('domain')}`
  }

  return email.send({
    template,
    'locals': {
      'signoff': signoffs[Math.floor(Math.random() * signoffs.length)],
      domainUrl,
      ...locals,
    },
    'message': {
      to,
    },
  })
}
