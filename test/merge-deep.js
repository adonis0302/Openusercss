import test from 'ava'
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
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
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
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
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
        '__typename': 'User',
        '_id':        '5a262a2c3835ee7627db2ef9'
      },
      'version': '2.0.0'
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

  t.deepEqual(merged, expected)
})

test('does not remove existing objects', async (t) => {
  const merged = mergeDeep(state.themes, '_id', [
    {
      '_id': '5a275431707d23a322cff59f'
    }
  ])
  const expected = state.themes

  t.deepEqual(merged, expected)
})

test('throws error if no arguments are given', (t) => {
  t.throws(() => {
    mergeDeep()
  })
})

test('throws error if no source is given', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-undefined
    mergeDeep(undefined, '_id', [
      {
        '_id': '5a275431707d23a322cff588'
      }
    ])
  })
})

test('throws error if no key is given', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-undefined
    mergeDeep(state.themes, undefined, [
      {
        '_id': '5a275431707d23a322cff588'
      }
    ])
  })
})

test('throws error if no new data are given', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id')
  })
})

test('throws error if new data is null', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id', null)
  })
})

test('throws error if new data is empty', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id', [
      {}
    ])
  })
})

test('throws error if new data is undefined', (t) => {
  t.throws(() => {
    // eslint-disable-next-line no-undefined
    mergeDeep(state.themes, '_id', undefined)
  })
})

test('throws error if new data is an object', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id', {})
  })
})

test('throws error if new data is a number', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id', 5)
  })
})

test('throws error if new data is string', (t) => {
  t.throws(() => {
    mergeDeep(state.themes, '_id', 'Hello!')
  })
})
