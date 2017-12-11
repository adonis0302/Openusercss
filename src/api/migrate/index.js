import uriComponentMigration from './modules/uricomponent-themecontent'

export default async (db) => {
  let result = null

  result = await uriComponentMigration(db)

  return result
}
