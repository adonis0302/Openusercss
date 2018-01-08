import test from 'ava'

import state from './shared/state-mock'
import getters from '../src/client/js/store/getters'

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
