import devtools from 'postcss-devtools'
import rucksack from 'rucksack-css'
import flexibility from 'postcss-flexibility'
import fixes from 'postcss-fixes'
import willChange from 'postcss-will-change'
import willChangeTransition from 'postcss-will-change-transition'
import ellipsis from 'postcss-ellipsis'

import cssnano from 'cssnano'
import advancedPreset from 'cssnano-preset-advanced'
import {appConfig,} from './config'
import processObject from '../../src/shared/process-object'

const customPreset = advancedPreset({
  'discardComments':     false,
  'normalizeWhitespace': false,
})

export const postCssPluginsFunctional = [
  devtools(),
  // Syntax extending plugins
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false,
  }),
  ellipsis(),
  // Zero-effort feature adding plugins
  flexibility(),
  willChange(),
  willChangeTransition(),
]

export const postCssPluginsProdComponents = [
  ...postCssPluginsFunctional,
  fixes(),
  cssnano({
    'preset': customPreset,
  }),
]

export const postCssPluginsProd = [
  ...postCssPluginsFunctional,
  fixes(),
  cssnano({
    'preset': 'advanced',
  }),
]

export const ourSassConfig = processObject(appConfig.get(), (index, value) => {
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

  if (value === 0) {
    return value
  }

  return `"${value}"`
})

export const iconSizesPx = [
  16,
  32,
  64,
  128,
]

export const bgSizesPx = [
  1366,
  1920,
  640,
  360,
  128,
]

export const elementSizesPx = [
  128,
  360,
  640,
  960,
  1366,
  1920,
]

const sizes = []

elementSizesPx.forEach((width) => {
  sizes.push({
    'suffix':  `x${width}`,
    'upscale': false,
    width,
  })
})

const iconSizes = []

iconSizesPx.forEach((iconSize) => {
  iconSizes.push({
    'suffix':  `x${iconSize}`,
    'width':   iconSize,
    'upscale': false,
  })
})

const bgSizes = []

bgSizesPx.forEach((bgSize) => {
  bgSizes.push({
    'suffix':  `x${bgSize}`,
    'width':   bgSize,
    'upscale': false,
  })
})

export {
  sizes,
  iconSizes,
  bgSizes,
}
