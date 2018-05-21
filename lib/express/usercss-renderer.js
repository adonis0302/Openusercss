import Theme from 'api/connector/schema/theme'
import {stringify,} from 'usercss-meta'

export default async (req, res, next) => {
  const foundTheme = await Theme.findOne({
    '_id': req.params.id,
  }, {
    'populate': true,
  })

  console.log('Rendering', JSON.stringify(foundTheme.variables, null, 4))

  if (foundTheme) {
    if (!foundTheme.ratings) {
      foundTheme.ratings = []
    }

    res.type('css')
    res.write(stringify({
      'name':         foundTheme.title,
      'namespace':    `https://openusercss.org/theme/${foundTheme._id}`,
      'homepageURL':  `https://openusercss.org/theme/${foundTheme._id}`,
      'version':      foundTheme.version,
      'license':      foundTheme.license,
      'description':  foundTheme.description,
      'vars':         foundTheme.variables,
      'author':       `${foundTheme.user.displayname} (https://openusercss.org/profile/${foundTheme.user._id})`,
      'preprocessor': 'uso',
    }, {
      'alignKeys': true,
    }))
    res.write(`\n\n${foundTheme.content}\n`)
    res.send()
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
