import test from 'ava'
import state from './shared/state-mock'
import getters from '../src/client/js/store/getters'

test('users - expands from themes', (t) => {
  const result = getters.users(state)
  const expected = [
    {
      '__typename': 'User',
      '_id':        '5a262a2c3835ee7627db2ef9',
      'lastSeen':   '2017-12-06T02:21:12.373Z',
      'username':   'decentm',
      'themes':     [
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
    }
  ]

  t.deepEqual(result, expected)
})

test('users - gives empty object with empty state', (t) => {
  const result = getters.users({
    'users': []
  })
  const expected = []

  t.deepEqual(result, expected)
})

test('users - gives empty array with no themes', (t) => {
  const result = getters.users({
    'users': [
      {
        'themes': null
      }
    ]
  })
  const expected = [
    {
      'themes': []
    }
  ]

  t.deepEqual(result, expected)
})

test('themes - expands from users', (t) => {
  const result = getters.themes(state)
  const expected = [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     0,
      'title':      'asd',
      'user':       {
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9',
        'lastSeen':   '2017-12-06T02:21:12.373Z',
        'username':   'decentm',
        'themes':     [
          {
            '__typename': 'Theme',
            '_id':        '5a275431707d23a322cff59f'
          }
        ]
      },
      'version': '1.0.0'
    }
  ]

  t.deepEqual(result, expected)
})

test('themes - creates user object even if none exists', (t) => {
  const result = getters.themes({
    'themes': [
      {
        '_id':   '5a275431707d23a322cff59f',
        'title': 'asd',
        'user':  {
          '_id': '5a262a2c3835ee7627db2ef9'
        }
      }
    ]
  })
  const expected = [
    {
      '_id':   '5a275431707d23a322cff59f',
      'title': 'asd',
      'user':  {
        'themes': []
      }
    }
  ]

  t.deepEqual(result, expected)
})

test('themes - gives empty object from empty state', (t) => {
  const result = getters.themes({
    'themes': []
  })
  const expected = []

  t.deepEqual(result, expected)
})

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
  const result = getters.currentUser({})
  const expected = {}

  t.deepEqual(result, expected)
})

test('currentUser - returns user from state', (t) => {
  const result = getters.currentUser(state)
  const expected = {
    '__typename': 'User',
    '_id':        '5a262a2c3835ee7627db2ef9',
    'lastSeen':   '2017-12-06T02:21:12.373Z',
    'username':   'decentm',
    'themes':     [
      {
        '__typename': 'Theme',
        '_id':        '5a275431707d23a322cff59f'
      }
    ]
  }

  t.deepEqual(result, expected)
})
