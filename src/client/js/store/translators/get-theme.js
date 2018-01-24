import {cloneDeep,} from 'lodash'
import {apolloClient,} from '../actions'
import {ServerError,} from '../../../../shared/custom-errors'
import {
  theme,
  themes,
} from '../actions/helpers/queries'
import {upsert,} from '../db'

import {getUser,} from './get-user'

export const renderOptions = (options) => {
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

  const user = await getUser({
    'id': doneTheme.user._id,
  })

  upsert('users', user)
  return doneTheme
}

export const getThemes = async (query) => {
  let results = null

  try {
    results = await apolloClient.query({
      'query': themes({
        'query': escape(JSON.stringify(query)),
      }),
    })
  } catch (error) {
    throw new ServerError({
      'message': error.message,
    })
  }

  results.themes = results.themes.filter((themeResult) => {
    themeResult.options = renderOptions(themeResult.options)
    upsert('themes', themeResult)

    return themeResult
  })

  return results.themes
}
