import 'babel-polyfill'
import log from 'chalk-console'

import signals from 'lib/express/signal-handler'
import {apiInit, clientInit, apiServer, clientServer,} from './combiner'

Promise.all([
  clientInit(),
  apiInit(),
])
.catch(log.error)

signals({
  'name':   'MAIN',
  'thread': process,
  cleanup () {
    clientServer.close()
    apiServer.close()
  },
})
