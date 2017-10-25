/* eslint no-console:0 */
import gulp from 'gulp'
import legalEagle from 'legal-eagle'

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
