import test from 'ava'
import {cloneDeep} from 'lodash'
import mutations, {IterableMutation} from '../src/client/js/store/mutations'
import stateMock from './shared/state-mock'

test('login - sets session in state', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  // eslint-disable-next-line no-undefined
  state.session = undefined
  expected.session = {
    'token': 'viD4aigh1ke7eej7ow6Raogu8u',
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  }

  mutations.login(state, {
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
    'user':  {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  }

  mutations.login(state, {
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

test('saveTheme - modifies existing theme', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.themes = [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     0,
      'title':      'My new title',
      'user':       {
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      },
      'version': '1.0.2'
    }
  ]

  mutations.saveTheme(state, {
    '_id':     '5a275431707d23a322cff59f',
    'version': '1.0.2',
    'title':   'My new title',
    'user':    {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  })

  t.deepEqual(state, expected)
})

test('saveTheme - adds new theme', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.themes = [
    {
      '_id':     '5a275431707d23a322cff5a0',
      'title':   'This brand new theme!',
      'version': '1.1.6',
      'user':    {
        '_id': '5a262a2c3835ee7627db2ef9'
      }
    },
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     0,
      'title':      'asd',
      'user':       {
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      },
      'version': '1.0.0'
    }
  ]

  mutations.saveTheme(state, {
    '_id':     '5a275431707d23a322cff5a0',
    'version': '1.1.6',
    'title':   'This brand new theme!',
    'user':    {
      '_id': '5a262a2c3835ee7627db2ef9'
    }
  })

  t.deepEqual(state, expected)
})

test('loading - sets to true', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  expected.loading = true

  mutations.loading(state, true)
  t.deepEqual(state, expected)
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

  expected.users = [
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
  ]

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
