import Theme from '../../connector/schema/theme'
import {getRatings,} from './get-rating'
import log from 'chalk-console'

export const getTheme = async (query) => {
  let theme = null

  try {
    theme = await Theme.findOne(query, {
      'populate': true,
    })
  } catch (error) {
    log.error(error)
  }

  if (theme) {
    theme.ratings = await getRatings({
      'theme': theme._id,
    })

    theme.options = theme.options.filter((option) => {
      option.value = JSON.stringify(option.value) || ''
      option.label = option.label || ''
      option.name = option.name || ''

      return option
    })
  }

  return theme
}
