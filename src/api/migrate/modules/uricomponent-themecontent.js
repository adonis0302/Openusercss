import log from 'chalk-console'

const decoded = (value) => {
  const result = decodeURIComponent(value)

  return result === value
}

export default async ({Theme}) => {
  let result = null
  let migratedCount = 0
  const themes = await Theme.find({})

  await themes.forEach(async (theme) => {
    if (theme && !decoded(theme.content)) {
      let loopCount = 0

      while (theme.content && !decoded(theme.content) && loopCount < 100) {
        log.info(`Migrating ${theme.title}, ${theme._id}`)
        theme.content = decodeURIComponent(theme.content)
        loopCount = loopCount + 1
      }

      if (loopCount >= 100) {
        throw new Error('Migration loop got stuck. Counter exceeded 100')
      }

      await theme.save()
      migratedCount = migratedCount + 1
    }
  })

  log.info(`Migrated ${migratedCount} not URI encoded themes`)
  result = true
  return result
}
