import Theme from '../../connector/schema/theme'
import {superstruct,} from 'superstruct'

const struct = superstruct({
  'types': {
    'any': () => true,
  },
})
const validators = {}

validators.option = struct({
  'type':  'string',
  'label': 'string',
  'name':  'string',
  'value': 'string',
})

export const getTheme = async (query) => {
  const theme = await Theme.findOne(query, {
    'populate': false,
  })

  if (theme) {
    theme.options = theme.options.filter((option) => {
      option.value = JSON.stringify(option.value)
      try {
        return validators.option(option)
      } catch (error) {
        return ''
      }
    })
  }

  return theme
}

export const getThemes = async (query, options = {}) => {
  options.populate = true
  const foundThemes = await Theme.find(query, options)

  if (foundThemes) {
    const themes = await Promise.all(foundThemes.filter(async (theme) => {
      theme.options = theme.options.filter((option) => {
        option.value = JSON.stringify(option.value)
        return option
      })
      theme.user = theme.user._id

      return theme
    }))

    return themes
  }

  return []
}
