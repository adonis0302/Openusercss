const {DefinePlugin,} = require('webpack')
const git = require('git-revision')
const fs = require('fs')

// eslint-disable-next-line no-sync
const licenses = fs.readFileSync('./licenses.json')

module.exports = {
  webpack (config, options, webpack,) {
    config.entry.main = [
      './api/index.js',
    ]

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
}
