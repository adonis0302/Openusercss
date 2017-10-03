const Conf = require('conf')
const clyConfig = new Conf({
  'cwd':        '.',
  'configName': 'config'
})
const options = {}
const {freeze} = Object
const parseAuthor = require('parse-author')

// IP ADDRESSES
// Get the most remote IP address on interfaces for browserSync
const os = require('os')
const first = require('lodash').first
const address = require('address')
const ips = []
const ifaces = os.networkInterfaces()

for (const dev in os.networkInterfaces()) {
  if (Object.prototype.hasOwnProperty.call(ifaces, dev)) {
    ips.splice(0, 0, address.ip(dev))
  }
}

const myIp = first(ips)

const iconSizesPx = [
  32,
  128,
  512
]

const bgSizesPx = [
  1366,
  1920,
  700,
  360
]

freeze(options)

const processObject = (object, func) => {
  for (const index in object) {
    if (typeof object[index] === 'object') {
      object[index] = processObject(object[index], func)
    } else {
      object[index] = func(index, object[index])
    }
  }

  return object
}

const ourSassConfig = processObject(clyConfig.get(), (index, value) => {
  if (value[0] === '#') {
    return value
  } else if (
    value.includes
    && (value.includes('rem')
      || value.includes('em')
      || value.includes('px')
      || value.includes('%')
      || value.includes('vh')
      || value.includes('vw')
    )
  ) {
    return value
  }

  return `"${value}"`
})

const returnAuthors = (pkgName) => {
  let author = null

  try {
    author = require(`../../node_modules/${pkgName}/package.json`).author
  } catch (err_) {
    return null
  }
  const orgAuthor = author

  if (author instanceof Array) {
    const temp = []

    author.forEach((tmpAuthor) => {
      temp.push(parseAuthor(tmpAuthor).name)
    })

    return temp.join(', ')
  }

  switch (typeof author) {
  case 'string':
    try {
      author = parseAuthor(author).name
    } catch (err_) {
      author = orgAuthor
    }
    break
  case 'object':
    author = parseAuthor(author.name).name
    break
  default:
    break
  }

  return author
}

const {includes, forIn, defaultsDeep} = require('lodash')
const gitUrl = require('github-url-from-git')
const requireFile = require('require-file')

const prepareObject = (pkg) => {
  const pkgDefault = {
    'name':            'Unknown',
    'license':         'Unknown',
    'source':          'Unknown',
    'repository':      '',
    'author':          null,
    'importedLicense': false,
    'sourceText':      [
      'Unknown'
    ]
  }

  return defaultsDeep(pkg, pkgDefault)
}

const processSummary = (summary) => {
  const result = []

  forIn(summary, (value, key) => {
    if (includes(value.repository, '@')) {
      value.repository = gitUrl(String(value.repository))
    }
    if (!value.repository) {
      value.repository = `https://npmjs.com/package/${String(key).split('@')[0]}`
    }
    value.repository = String(value.repository).replace('git+', '')

    value.author = returnAuthors(String(key).split('@')[0])

    if (!value.sourceText) {
      try {
        value.sourceText = requireFile(`../licenses/${String(value.license).toUpperCase().replace(' ', '_')}`)
        value.importedLicense = true
      } catch (err) {
        throw new Error(`An error occurred while importing a license for ${key}:
  ${err}
        `)
      }
    }

    result.push(prepareObject({
      'name':            String(key).split('@')[0],
      'license':         value.license,
      'source':          value.source,
      'repository':      value.repository,
      'authors':         value.author,
      'importedLicense': value.importedLicense,
      'sourceText':      String(value.sourceText).split(/(?:\r\n|\r|\n)/g)
    }))
  })

  return result
}

module.exports = {
  clyConfig,
  options,
  myIp,
  iconSizesPx,
  bgSizesPx,
  processObject,
  returnAuthors,
  processSummary,
  ourSassConfig
}
