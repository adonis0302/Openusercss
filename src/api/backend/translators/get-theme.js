import Theme from '../../connector/schema/theme'
import {getRatings,} from './get-rating'
import raven from 'raven'

export const getTheme = async (query) => {
  let theme = null

  try {
    theme = await Theme.findOne(query, {
      'populate': true,
    })

    if (theme) {
      theme.ratings = await getRatings({
        'theme': theme._id,
      }) || []

      theme.options = theme.options.filter((option) => {
        option.value = JSON.stringify(option.value) || ''
        option.label = option.label || ''
        option.name = option.name || ''

        return option
      })
    }
  } catch (error) {
    raven.captureException(error)
  }

  return theme
}

export const getThemes = async (query, options) => {
  let themes = null

  options.populate = false
  try {
    themes = await Theme.find(query, options)

    if (themes) {
      themes = await Promise.all(themes.map(async (theme) => {
        return getTheme({
          '_id': theme._id,
        })
      }))
    }
  } catch (error) {
    raven.captureException(error)
  }

  return themes
}
