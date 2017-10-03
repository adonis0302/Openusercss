const gulp = require('gulp')
const del = require('del')
const {spawnSync} = require('child_process')

const cleanBuild = (done) => {
  del.sync([
    'build'
  ])
  done()
}

gulp.task('zip-source', (done) => {
  spawnSync('git', ['archive', '--format=zip', '-o', 'build/source.zip', '-9', 'HEAD'])
  done()
})

gulp.task('build', gulp.series(
  cleanBuild,
  gulp.parallel('js-build', 'media-build')
))
