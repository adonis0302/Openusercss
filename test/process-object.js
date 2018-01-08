import test from 'ava'
import {cloneDeep,} from 'lodash'

import processObject from '../src/shared/process-object'
import stateMock from './shared/state-mock'

test('processObject - runs function on object', (t) => {
  let state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  Reflect.deleteProperty(state, 'actionErrors')
  Reflect.deleteProperty(expected, 'actionErrors')
  Reflect.deleteProperty(state, 'loading')
  Reflect.deleteProperty(expected, 'loading')
  Reflect.deleteProperty(state.themes[0], 'rating')
  Reflect.deleteProperty(expected.themes[0], 'rating')

  state = processObject(state, (value) => {
    return encodeURIComponent(value)
  })

  expected.session.ua = 'Mozilla%2F5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F62.0.3202.94%20Safari%2F537.36'
  expected.themes[0].content = '%40-moz-document%20regexp(%22.*openusercss.org.*%22)%20%7Bbody%20%7Bcontent%3A%20%22yaeee%22%3B%7D%7D'
  expected.themes[0].description = 'test%20description'
  expected.themes[0].lastUpdate = '2017-12-31T09%3A20%3A29.234Z'
  expected.themes[0].createdAt = '2017-12-31T09%3A20%3A29.234Z'
  expected.users[0].lastSeen = '2017-12-06T02%3A21%3A12.373Z'

  t.deepEqual(state, expected)
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
