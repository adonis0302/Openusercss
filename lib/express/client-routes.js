import {Nuxt, Builder,} from 'nuxt'
import express from 'express'
import nuxtConfig from '~/nuxt.config'

const cacheOptions = {
  'extensions': [
    'html',
    'htm',
    'js',
  ],
  'index':  false,
  'maxAge': '14d',
}

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

  app.use(express.static('app/static', cacheOptions))
  app.use(nuxt.render)
}
