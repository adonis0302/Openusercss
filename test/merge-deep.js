import test from 'ava'
import {cloneDeep} from 'lodash'
import mergeDeep from '../src/shared/merge-deep'
import state from './shared/state-mock'

test('modifies existing objects', async (t) => {
  const merged = mergeDeep(state.themes, '_id', [
    {
      '_id':     '5a275431707d23a322cff59f',
      'rating':  1,
      'version': '1.0.1'
    }
  ])
  const expected = [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     1,
      'title':      'asd',
      'user':       {
        '_id': '5a262a2c3835ee7627db2ef9'
      },
      'version': '1.0.1'
    }
  ]

  t.deepEqual(merged, expected)
})

test('adds new objects', async (t) => {
  const merged = mergeDeep(state.themes, '_id', [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff588',
      'rating':     3,
      'title':      'Hello',
      'user':       {
        '_id': '5a262a2c3835ee7627db2ef9'
      },
      'version': '2.0.0'
    }
  ])
  const expected = [
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff588',
      'rating':     3,
      'title':      'Hello',
      'user':       {
        '_id': '5a262a2c3835ee7627db2ef9'
      },
      'version': '2.0.0'
    },
    {
      '__typename': 'Theme',
      '_id':        '5a275431707d23a322cff59f',
      'rating':     0,
      'title':      'asd',
      'user':       {
        '_id': '5a262a2c3835ee7627db2ef9'
      },
      'version': '1.0.0'
    }
  ]

  t.deepEqual(merged, expected)
})
