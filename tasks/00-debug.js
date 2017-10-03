/* eslint no-console:0 */
const {
  clyConfig,
  options,
  myIp
} = require('./appshell')
const gulp = require('gulp')
const legalEagle = require('legal-eagle')

gulp.task('debug', (done) => {
  console.log('Config:')
  console.log(clyConfig.get())
  console.log('Options:')
  console.log(options)
  console.log('IP:')
  console.log(myIp)
  console.log('Main module:')
  console.log(process.mainModule)

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
