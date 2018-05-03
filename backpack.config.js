const {DefinePlugin,} = require('webpack')
const git = require('git-revision')
const fs = require('fs')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

/* eslint-disable-next-line no-sync */
const licenses = fs.readFileSync('./licenses.json')

const createConfig = ({entry,}) => ({
  webpack (config, options, webpack,) {
    config.entry.main = [
      entry,
    ]

    config.resolve.alias = Object.assign({
      '~':      path.resolve(__dirname),
      'lib':    path.resolve(__dirname, 'lib'),
      'api':    path.resolve(__dirname, 'api'),
      'client': path.resolve(__dirname, 'client'),
    }, config.resolve.alias, {})

    config.plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        '__DEV__':              process.env.NODE_ENV === 'development',
      }),

      new webpack.BannerPlugin({
        'raw':       true,
        'entryOnly': false,
        'banner':    "require('source-map-support/register')",
      }),

      new DefinePlugin({
        'OUC.version': {
          'revisionTag':    JSON.stringify(git('tag')),
          'revisionLong':   JSON.stringify(git('long')),
          'revisionShort':  JSON.stringify(git('short')),
          'revisionBranch': JSON.stringify(git('branch')),
        },
        'OUC.licenses': licenses.toString(),
      }),

      new FriendlyErrorsWebpackPlugin({
        'clearConsole': false,
      }),
    ]

    return config
  },
})

module.exports = createConfig({
  'entry': './index.js',
})
