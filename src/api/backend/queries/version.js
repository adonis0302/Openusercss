import gitCb from 'git-rev'
import pify from 'pify'
import {zipObject} from 'lodash'

const git = pify(gitCb, {
  'errorFirst': false
})

export default async () => {
  const props = [
    'revisionLong',
    'revisionShort',
    'revisionTag',
    'revisionBranch'
  ]

  const results = await Promise.all([
    git.long(),
    git.short(),
    git.tag(),
    git.branch()
  ])

  return zipObject(props, results)
}
