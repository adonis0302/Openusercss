import test from 'ava'
import {cloneDeep,} from 'lodash'

import mutations from '../src/client/js/store/mutations'
import stateMock from './shared/state-mock'

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
