import devtools from 'postcss-devtools'
import rucksack from 'rucksack-css'
import flexibility from 'postcss-flexibility'
import fixes from 'postcss-fixes'
import zindex from 'postcss-zindex'
import {processObject, appConfig} from '../appshell'

export const postCssPluginsProd = [
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false
  }),
  zindex(),
  fixes(),
  flexibility()
]

export const postCssPluginsFast = [
  devtools(),
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false
  })
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

  return `"${value}"`
})

export const iconSizesPx = [
  16,
  32,
  64,
  128
]

export const bgSizesPx = [
  1366,
  1920,
  360,
  128
]

export const elementSizesPx = [
  128,
  360,
  640,
  960,
  1366,
  1920
]

const sizes = []

elementSizesPx.forEach((width) => {
  sizes.push({
    'suffix':  `x${width}`,
    'upscale': false,
    width
  })
})

const iconSizes = []

iconSizesPx.forEach((iconSize) => {
  iconSizes.push({
    'suffix':  `x${iconSize}`,
    'width':   iconSize,
    'upscale': false
  })
})

const bgSizes = []

bgSizesPx.forEach((bgSize) => {
  bgSizes.push({
    'suffix':  `x${bgSize}`,
    'width':   bgSize,
    'upscale': false
  })
})

export {
  sizes,
  iconSizes,
  bgSizes
}
