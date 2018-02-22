import Theme from './connector/schema/theme'
import {buildTheme,} from '../shared/usercss-builder'

export default async (req, res, next) => {
  const foundTheme = await Theme.findOne({
    '_id': req.params.id,
  }, {
    'populate': true,
  })

  if (!foundTheme.ratings) {
    foundTheme.ratings = []
  }

  if (foundTheme) {
    const theme = await buildTheme(foundTheme, foundTheme.user)

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
