module.exports = function VueApollo () {
  this.extendBuild((config) => {
    config.resolve.extensions = config.resolve.extensions.concat('.graphql', '.gql')
    config.module.rules.push({
      'test': /\.(graphql|gql)$/,
      'use':  'graphql-tag/loader',
    })
  })
}
