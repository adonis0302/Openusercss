import test from 'ava'
import {cloneDeep, defaultsDeep} from 'lodash'

import mutations, {IterableMutation} from '../src/client/js/store/mutations'
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
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
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
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
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
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  }

  mutations.login(state, {
    'ip':    '172.16.22.12',
    'ua':    'curl/5.0',
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
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

test('actionError - clears errors if passed null', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.actionErrors = []

  mutations.actionError(state, null)
  t.deepEqual(state, expected)
})

test('actionError - adds error to state', (t) => {
  const state = cloneDeep(stateMock)
  const originalState = cloneDeep(stateMock)

  mutations.actionError(state, new Error('Test'))
  t.true(state.actionErrors.length === originalState.actionErrors.length + 1)
})

test('actionError - does not add error to state if duplicate', (t) => {
  const state = cloneDeep(stateMock)
  const originalState = cloneDeep(stateMock)

  mutations.actionError(state, new Error('Test'))
  mutations.actionError(state, new Error('Test'))
  t.true(state.actionErrors.length === originalState.actionErrors.length + 1)
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

  expected.users = []
  expected.themes = []
  expected.actionErrors = []
  expected.loading = false

  mutations.clearCache(state)
  t.deepEqual(state, expected)
})

test('deleteTheme - removes theme from state', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.themes = []
  expected.users = [
    {
      '_schema':    {},
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9',
      'lastSeen':   '2017-12-06T02:21:12.373Z',
      'username':   'decentm',
      'themes':     []
    }
  ]

  mutations.deleteTheme(state, '5a275431707d23a322cff59f')
  t.deepEqual(state, expected)
})

test('deleteTheme - throws if argument is not a string', (t) => {
  const state = cloneDeep(stateMock)

  t.throws(() => {
    mutations.deleteTheme(state, {
      '_id': '5a275431707d23a322cff59f'
    })
  })
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

test('iterable - adds to state', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.users.unshift({
    '_id':      '5a262a2c3835ee7627db2efa',
    'lastSeen': '2017-12-06T02:21:12.373Z',
    'username': 'decentm'
  })
  const mutation = new IterableMutation('User', 'users')

  mutation(state, [
    {
      '_id':      '5a262a2c3835ee7627db2efa',
      'lastSeen': '2017-12-06T02:21:12.373Z',
      'username': 'decentm'
    }
  ])

  t.deepEqual(state, expected)
})

test('iterable - updates already existing', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)
  const mutation = new IterableMutation('User', 'users')

  /* expected.users = [
    {
      '__typename':  'User',
      '_id':         '5a262a2c3835ee7627db2ef9',
      'lastSeen':    '2017-12-06T02:21:12.373Z',
      'username':    'decentm',
      'displayname': 'NotMyName',
      'themes':      [
        {
          '__typename': 'Theme',
          '_id':        '5a275431707d23a322cff59f'
        }
      ]
    }
  ] */
  expected.users[0] = defaultsDeep({
    'displayname': 'NotMyName'
  }, expected.users[0])

  mutation(state, [
    {
      '_id':         '5a262a2c3835ee7627db2ef9',
      'displayname': 'NotMyName'
    }
  ])

  t.deepEqual(state, expected)
})

test('iterable - does not touch state with empty argument', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)
  const mutation = new IterableMutation('User', 'users')

  mutation(state, [])

  t.deepEqual(state, expected)
})

test('iterable - throws with empty object in argument', (t) => {
  const state = cloneDeep(stateMock)
  const mutation = new IterableMutation('User', 'users')

  t.throws(() => {
    mutation(state, [
      {}
    ])
  })
})

test('iterable - throws with empty objects in argument', (t) => {
  const state = cloneDeep(stateMock)
  const mutation = new IterableMutation('User', 'users')

  t.throws(() => {
    mutation(state, [
      {},
      {}
    ])
  })
})

/*
test('', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  t.deepEqual(state, expected)
})
*/
