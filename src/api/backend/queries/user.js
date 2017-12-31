import {ObjectId} from 'mongodb'

export default async (root, {id}, {Session, Theme, User, Rating}) => {
  const foundUser = await User.findOne({
    '_id': new ObjectId(id)
  }, {
    'populate': true
  })

  if (!foundUser) {
    throw new Error('No user found')
  }

  const themes = foundUser.themes.map(async (theme) => {
    const rates = theme.ratings.map((rating) => {
      return Rating.findOne({
        '_id': rating
      })
    })

    theme.ratings = await Promise.all(rates)
    return theme
  })

  foundUser.themes = await Promise.all(themes)
  return foundUser
}
