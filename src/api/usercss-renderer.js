import {getTheme,} from './backend/translators/get-theme'
import {getUser,} from './backend/translators/get-user'
import {buildTheme,} from '../shared/usercss-builder'

export default async (req, res, next) => {
  const foundTheme = await getTheme({
    '_id': req.params.id,
  })
  const user = await getUser({
    '_id': foundTheme.user,
  })

  if (!foundTheme.ratings) {
    foundTheme.ratings = []
  }

  if (foundTheme) {
    const theme = await buildTheme(foundTheme, user)

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
