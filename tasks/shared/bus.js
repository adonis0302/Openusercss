// import PubSub from 'PubSub'
import gutil from 'gulp-util'
import Mitt from 'mitt'
const emitter = new Mitt()

gutil.log('Created new emitter')

export default emitter
