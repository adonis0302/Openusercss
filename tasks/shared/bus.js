// import PubSub from 'PubSub'
import gutil from 'gulp-util'
import Mitt from 'mitt'
import {debounce} from 'lodash'
const emitter = new Mitt()

gutil.log('Created new emitter')

export const sendMessage = (message) => {
  gutil.log(`Sending ${message}`)
  debounce(() => {
    emitter.emit(message)
  }, 250)
}

export default emitter
