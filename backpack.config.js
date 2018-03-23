const {DefinePlugin,} = require('webpack')
const git = require('git-revision')

module.exports = {
  webpack (config, options, webpack,) {
    config.entry.main = [
      './api/index.js',
    ]

    config.plugins.push(new DefinePlugin({
      'OUC.version': {
        'revisionLong':   JSON.stringify(git('long')),
        'revisionShort':  JSON.stringify(git('short')),
        'revisionTag':    JSON.stringify(git('tag')),
        'revisionBranch': JSON.stringify(git('branch')),
      },
    }))

    return config
  },
}
