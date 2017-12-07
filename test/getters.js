import test from 'ava'
import {pick} from 'lodash'

import state from './shared/state-mock'
import getters from '../src/client/js/store/getters'

test('users - expands from themes', (t) => {
  const result = getters.users(state)
  const expected = []

  expected.push(pick(state.users[0], [
    '_schema',
    '__typename',
    '_id',
    'lastSeen',
    'username'
  ]))

  expected[0].themes = []
  expected[0].themes.push(state.themes[0])

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
  const expected = []

  expected.push(pick(state.themes[0], [
    '_schema',
    '__typename',
    '_id',
    'rating',
    'title',
    'description',
    'content',
    'version'
  ]))

  expected[0].user = state.users[0]
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
  const result = getters.currentUser({
    // eslint-disable-next-line no-undefined
    'session': undefined
  })
  const expected = {}

  t.deepEqual(result, expected)
})

test('currentUser - returns user from state', (t) => {
  const result = getters.currentUser({
    'users': [
      {
        '_id':      '5a262a2c3835ee7627db2ef9',
        'username': 'decentm'
      }
    ],
    'session': {
      'user': {
        '_id': '5a262a2c3835ee7627db2ef9'
      }
    }
  })
  const expected = {
    '_id':      '5a262a2c3835ee7627db2ef9',
    'username': 'decentm'
  }

  t.deepEqual(result, expected)
})
