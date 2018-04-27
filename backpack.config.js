const {DefinePlugin,} = require('webpack')
const git = require('git-revision')
const fs = require('fs')
const path = require('path')

/* eslint-disable-next-line no-sync */
const licenses = fs.readFileSync('./licenses.json')

const createConfig = ({entry,}) => ({
  webpack (config, options, webpack,) {
    config.entry.main = [
      entry,
    ]

    config.resolve.modules = [
      'node_modules',
    ]

    config.resolve.alias = Object.assign({
      '~':      path.resolve(__dirname),
      'lib':    path.resolve(__dirname, 'lib'),
      'api':    path.resolve(__dirname, 'api'),
      'client': path.resolve(__dirname, 'client'),
    }, config.resolve.alias, {})

    config.plugins.push(new DefinePlugin({
      'OUC.version': {
        'revisionTag':    JSON.stringify(git('tag')),
        'revisionLong':   JSON.stringify(git('long')),
        'revisionShort':  JSON.stringify(git('short')),
        'revisionBranch': JSON.stringify(git('branch')),
      },
      'OUC.licenses': licenses.toString(),
    }))

    return config
  },
})

module.exports = createConfig({
  'entry': './api/index.js',
})
