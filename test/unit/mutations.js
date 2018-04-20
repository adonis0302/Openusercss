import test from 'ava'
import {cloneDeep,} from 'lodash'
import {ObjectID,} from 'mongodb'
import mutations from '../../client/client/js/store/mutations'

const stateMock = {
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

test('login - sets session in state from null', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  // eslint-disable-next-line no-undefined
  state.session = undefined
  expected.session = {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  })
  t.deepEqual(state, expected)
})

test('login - sets session in state from other', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  state.session = []
  expected.session = {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  })
  t.deepEqual(state, expected)
})

test('login - overrides session in state', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.session = {
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9',
    },
  })
  t.deepEqual(state, expected)
})

test('logout - sets session to null', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.session = null

  mutations.logout(state)
  t.deepEqual(state, expected)
})

test('actionError - throws if argument is not an error', (t) => {
  const state = cloneDeep(stateMock)

  t.throws(() => {
    mutations.actionError(state, 'Hello!')
  })
})

test('clearCache - empties users, themes, actionErrors and loading', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.actionErrors = []
  expected.loading = false

  mutations.clearCache(state)
  t.deepEqual(state, expected)
})

test('loading - sets to true', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.loading = true

  mutations.loading(state, true)
  t.deepEqual(state, expected)
})

test('loading - throws if not boolean', (t) => {
  const state = cloneDeep(stateMock)

  t.throws(() => {
    mutations.loading(state, 'unicorns')
  })
})

/*
test('', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  t.deepEqual(state, expected)
})
*/
