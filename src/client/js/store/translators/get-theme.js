import {cloneDeep,} from 'lodash'
import {apolloClient,} from '../actions'
import {ServerError,} from '../../../../shared/custom-errors'
import {theme, search,} from '../actions/helpers/queries'
import {upsert,} from '../db'

const renderOptions = (options) => {
  if (!options) {
    return []
  }

  return options.filter((option) => {
    let newValue = null

    try {
      newValue = JSON.parse(option.value)
    } catch (error) {
      newValue = option.value
    }

    option.value = newValue
    return option
  })
}

export const getTheme = async (query) => {
  let themeResult = null

  try {
    themeResult = await apolloClient.query({
      'query': theme(query),
    })
  } catch (error) {
    throw new ServerError({
      'message': error.message,
    })
  }

  const doneTheme = cloneDeep(themeResult.data.theme)

  doneTheme.options = renderOptions(doneTheme.options)
  upsert('themes', doneTheme)

  return doneTheme
}

export const getThemes = async (query) => {
  let searchResults = null

  try {
    searchResults = await apolloClient.query({
      'query': search(query),
    })
  } catch (error) {
    throw new ServerError({
      'message': error.message,
    })
  }

  searchResults.themes = searchResults.themes.filter((themeResult) => {
    themeResult.options = renderOptions(themeResult.options)
    upsert('themes', themeResult)

    return themeResult
  })

  return searchResults.themes
}
