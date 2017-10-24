const devtools = require('postcss-devtools')
const rucksack = require('rucksack-css')
const flexibility = require('postcss-flexibility')
const fixes = require('postcss-fixes')
const zindex = require('postcss-zindex')

const {
  processObject,
  clyConfig
} = require('../appshell')

const postCssPluginsProd = [
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

const postCssPluginsFast = [
  devtools(),
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false
  })
]

const ourSassConfig = processObject(clyConfig.get(), (index, value) => {
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

const iconSizesPx = [
  16,
  32,
  64,
  128
]

const bgSizesPx = [
  1366,
  1920,
  360,
  128
]

const elementSizesPx = [
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

module.exports = {
  postCssPluginsFast,
  postCssPluginsProd,
  ourSassConfig,
  sizes,
  iconSizes,
  bgSizes
}
