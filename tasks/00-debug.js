/* eslint no-console:0 */
import gulp from 'gulp'
// import legalEagle from 'legal-eagle'
// import fs from 'fs'
import path from 'path'
import walk from 'walk'

gulp.task('debug', (done) => {
  const walker = walk.walk(path.resolve(process.mainModule.paths[0], '../../../../.tmp'), {
    'followLinks': false
  })

  walker.on('file', (root, stat, next) => {
    console.log(`${root}/${stat.name}`)
    next()
  })
})
