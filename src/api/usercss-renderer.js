import {getTheme,} from './backend/translators/get-theme'
import {buildTheme,} from '../shared/usercss-builder'

export default async (req, res, next) => {
  const foundTheme = await getTheme({
    '_id': req.params.id,
  })

  if (!foundTheme.ratings) {
    foundTheme.ratings = []
  }

  if (foundTheme) {
    const theme = await buildTheme(foundTheme)

    res.type('css')
    res.send(theme)
  } else {
    res.type('json')
    res.status('404')
    res.send({
      'data':   null,
      'errors': [
        {
          'code':    'ENOTFOUND',
          'message': 'No theme found',
          'id':      req.params.id,
        },
      ],
    })
  }
}
