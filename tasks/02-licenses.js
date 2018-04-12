import gulp from 'gulp'
import eagle from 'legal-eagle'
import fs from 'fs'

gulp.task('licenses', (done) => {
  eagle({
    'path':           process.cwd(),
    'omitPermissive': true,
    'overrides':      {
      // I have a Flickity "Commercial Developer" license
      'flickity@2.1.1': {
        'license':    'MIT',
        'source':     '',
        'sourceText': '',
      },

      // License is in the package.json
      // https://github.com/leecrossley/isNumeric/blob/cb15ad5c1d7856d83ac3bcd0129f72dd20fec69c/package.json#L7
      'isnumeric@0.2.0': {
        'license':    'MIT',
        'source':     'package.json',
        'sourceText': '',
      },
    },
  }, (err, summary) => {
    if (err) {
      throw err
    }

    const final = []

    Object.keys(summary).forEach((index) => {
      final.push({
        'package': index,
        ...summary[index],
      })
    })

    fs.writeFile('./licenses.json', JSON.stringify(final), (error) => {
      if (error) {
        throw error
      }

      done()
    })
  })
})
