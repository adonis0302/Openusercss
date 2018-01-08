import test from 'ava'
import {cloneDeep,} from 'lodash'

import processObject from '../../src/shared/process-object'

test('processObject - runs function on object', (t) => {
  const source = {
    'thing': 'Hello, this is a thing',
  }
  const processed = processObject(source, (value) => {
    return encodeURIComponent(value)
  })
  const expected = {
    'thing': 'Hello%2C%20this%20is%20a%20thing',
  }

  t.deepEqual(processed, expected)
})

test('processObject - runs function on object recursively', (t) => {
  let state = {
    'one': [
      {
        'two': [
          {
            'three': [
              {
                'thing': 'this has spaces in it',
              },
            ],
          },
        ],
      },
    ],
  }
  const expected = cloneDeep(state)

  expected.one[0].two[0].three[0].thing = 'this%20has%20spaces%20in%20it'

  state = processObject(state, (value) => {
    return encodeURIComponent(value)
  })

  t.deepEqual(state, expected)
})

test('processObject - runs function on array', (t) => {
  let state = [
    'this has spaces in it',
  ]
  const expected = cloneDeep(state)

  expected[0] = 'this%20has%20spaces%20in%20it'

  state = processObject(state, (value) => {
    return encodeURIComponent(value)
  })

  t.deepEqual(state, expected)
})

test('processObject - runs function on array recursively', (t) => {
  let state = [
    'one',
    [
      {
        'two': [
          {
            'three': [
              {
                'thing': 'this has spaces in it',
              },
            ],
          },
        ],
      },
    ],
    {
      'four': [
        'this has spaces in it',
      ],
      'five': 'this has spaces in it',
    },
  ]
  const expected = cloneDeep(state)

  expected[1][0].two[0].three[0].thing = 'this%20has%20spaces%20in%20it'
  expected[2].four[0] = 'this%20has%20spaces%20in%20it'
  expected[2].five = 'this%20has%20spaces%20in%20it'

  state = processObject(state, (value) => {
    return encodeURIComponent(value)
  })

  t.deepEqual(state, expected)
})

/*
test('', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  t.deepEqual(state, expected)
})
*/
