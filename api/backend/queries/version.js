import git from 'git-revision'

export default async () => {
  return {
    'revisionLong':   git('long'),
    'revisionShort':  git('short'),
    'revisionTag':    git('tag'),
    'revisionBranch': git('branch'),
  }
}
