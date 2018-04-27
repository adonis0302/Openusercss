import {Nuxt, Builder,} from 'nuxt'
import nuxtConfig from '~/nuxt.config'

export default async ({app, config,}) => {
  const nuxt = new Nuxt(nuxtConfig)

  if (config.get('env') === 'development') {
    const builder = new Builder(nuxt)

    await builder.build()
  }

  app.use(nuxt.render)
}
