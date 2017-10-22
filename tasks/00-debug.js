/* eslint no-console:0 */
const gulp = require('gulp')
const legalEagle = require('legal-eagle')

gulp.task('debug', (done) => {
  legalEagle({
    'path': '../'
  }, (error, summary) => {
    if (error) {
      throw error
    }

    console.log(summary)
    done()
  })
})
