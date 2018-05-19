import {Nuxt, Builder,} from 'nuxt'
import nuxtConfig from '~/nuxt.config'

export default async ({app, config,}) => {
  let nuxt = new Nuxt({
    'dev':  nuxtConfig.dev,
    'head': nuxtConfig.head,
    'css':  nuxtConfig.css,
  })

  if (config.get('env') === 'development') {
    nuxt = new Nuxt(nuxtConfig)
    const builder = new Builder(nuxt)

    await builder.build()
  }

  app.use(nuxt.render)
}
