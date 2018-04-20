import test from 'ava'
import {ObjectID,} from 'mongodb'
import getters from '../../client/client/js/store/getters'

const state = {
  'loading': false,
  'session': {
    '_schema':    {},
    '__typename': 'Session',
    'ip':         '172.16.44.23',
    'ua':         'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    'token':      'kou7BueghaeHiehaetunahch8e',
    'user':       {
      '_schema':    {},
      '__typename': 'User',
      '_id':        new ObjectID('5a262a2c3835ee7627db2ef9'),
    },
  },
}

test('actionErrors - returns from state', (t) => {
  const result = getters.actionErrors(state)
  const expected = state.actionErrors

  t.deepEqual(result, expected)
})

test('session - returns from state', (t) => {
  const result = getters.session(state)
  const expected = state.session

  t.deepEqual(result, expected)
})

test('loading - returns from state', (t) => {
  const result = getters.loading(state)
  const expected = state.loading

  t.deepEqual(result, expected)
})

test('currentUser - returns empty object if session is missing', (t) => {
  const result = getters.currentUser({
    // eslint-disable-next-line no-undefined
    'session': undefined,
  })
  const expected = {}

  t.deepEqual(result, expected)
})
