import {uniq,} from 'lodash'

export default async () => {
  const fontsStart = Date.now()
  const fontset = await document.fonts.ready
  const fontResults = []

  for (const entries of fontset.entries()) {
    try {
      const {
        family,
        style,
        weight,
        stretch,
        status,
      } = await entries[0]

      fontResults.push({
        family,
        style,
        weight,
        stretch,
        status,
      })
    } catch (error) {
      const {
        family,
        style,
        weight,
        stretch,
        status,
      } = entries[0]

      fontResults.push({
        family,
        style,
        weight,
        stretch,
        status,
      })
    }
  }

  const perfStats = {
    'name': 'fontStats',
    'time': Date.now() - fontsStart,
  }

  return {
    'results': uniq(fontResults),
    perfStats,
  }
}
