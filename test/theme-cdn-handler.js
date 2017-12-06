import test from 'ava'
import {cloneDeep} from 'lodash'
import {ObjectID} from 'mongodb'

import {buildTheme} from '../src/api/theme-cdn-handler'
import stateMock from './shared/state-mock'

test('buildTheme - throws when nothing is passed', async (t) => {
  await t.throws(buildTheme())
})

test('buildTheme - correctly builds from theme object', async (t) => {
  const state = cloneDeep(stateMock)
  const expected = `/* ==userstyle==
@name asd
@description test description
@version 1.0.0
@namespace https://openusercss.org/theme/5a275431707d23a322cff59f
@homepageURL https://openusercss.org/theme/5a275431707d23a322cff59f
@author DecentM (https://openusercss.org/profile/5a262a2c3835ee7627db2ef9)
==/userstyle== */

@-moz-document regexp("undefined") {
  body {
    content: "yaeee";
  }
}
`
  const result = await buildTheme({
    ...state.themes[0],
    'user': {
      '_schema':     {},
      '_id':         new ObjectID('5a262a2c3835ee7627db2ef9'),
      'displayname': 'DecentM'
    }
  })

  t.deepEqual(result, expected)
})

/*
test('', (t) => {
  const state = cloneDeep(stateMock)
  const expected = cloneDeep(stateMock)

  t.deepEqual(state, expected)
})
*/
