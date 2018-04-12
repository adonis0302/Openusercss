module.exports = function apollo () {
  this.extendBuild((config) => {
    config.resolve.extensions = config.resolve.extensions.concat('.graphql', '.gql')
    const gqlRules = {
      'test':    /\.(graphql|gql)$/,
      'use':     'graphql-tag/loader',
      'exclude': /(node_modules)/,
    }

    config.module.rules.push(gqlRules)
  })
}
