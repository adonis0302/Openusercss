import test from 'ava'
import {request,} from 'graphql-request'

const api = 'http://localhost:5000'

test('uploaded theme exists in latest themes', async (t) => {
  const result = await request(api, `
    query {
      latestThemes(limit: 1) {
        _id
      }
    }
  `)

  t.truthy(result.latestThemes[0]._id)
})
