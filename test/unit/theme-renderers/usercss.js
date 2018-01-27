import test from 'ava'
import {ObjectID,} from 'mongodb'
import {buildTheme,} from '../../../src/shared/usercss-builder'

test('buildTheme - throws when nothing is passed', async (t) => {
  await t.throws(buildTheme())
})

test('buildTheme - correctly builds from theme object', async (t) => {
  const expected = `/* ==userstyle==
@name asd
@description test description
@version 1.0.0
@namespace https://openusercss.org/theme/5a275431707d23a322cff59f
@homepageURL https://openusercss.org/theme/5a275431707d23a322cff59f
@author DecentM (https://openusercss.org/profile/5a262a2c3835ee7627db2ef9)
@updateURL https://api.openusercss.org/theme/5a275431707d23a322cff59f.user.css
@preprocessor uso

@var text thing "My Title" hello
==/userstyle== */

@-moz-document regexp(".*openusercss.org.*") {body {content: "yaeee";}}`

  const result = await buildTheme({
    '_schema':     {},
    '__typename':  'Theme',
    '_id':         '5a275431707d23a322cff59f',
    'title':       'asd',
    'version':     '1.0.0',
    'content':     '@-moz-document regexp(".*openusercss.org.*") {body {content: "yaeee";}}',
    'description': 'test description',
    'createdAt':   '2017-12-31T09:20:29.234Z',
    'lastUpdate':  '2017-12-31T09:20:29.234Z',
    'screenshots': [],
    'options':     [
      {
        'type':  'text',
        'value': 'hello',
        'name':  'thing',
        'label': 'My Title',
      },
    ],
  }, {
    '_schema':     {},
    '_id':         new ObjectID('5a262a2c3835ee7627db2ef9'),
    'displayname': 'DecentM',
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
