import Theme from '../../connector/schema/theme'

export const getTheme = async (query) => {
  return Theme.findOne(query, {
    'populate': true,
  })
}

export const getThemes = async (query, options = {}) => {
  options.populate = false
  const foundThemes = await Theme.find(query, options)

  if (foundThemes) {
    const themes = await Promise.all(foundThemes.filter(async (theme) => {
      theme.options = theme.options.filter((option) => {
        option.value = JSON.stringify(option.value)
        return option
      })

      return theme
    }))

    return themes
  }

  return []
}
