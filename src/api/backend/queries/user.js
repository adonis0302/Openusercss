// import {ObjectId} from 'mongodb'
import getUser from '../translators/get-user'

export default async (root, {id}, {Session, Theme, User, Rating}) => {
  const foundUser = await getUser({
    '_id': id
  })

  if (!foundUser) {
    throw new Error('No user found')
  }

  /* const themes = foundUser.themes.map(async (theme) => {
    const rates = []

    theme.ratings.forEach((rating) => {
      if (rating) {
        rates.push(Rating.findOne({
          '_id': rating
        }))
      }
    })
    theme.ratings = await Promise.all(rates)
    theme.ratings = theme.ratings.filter((rating) => {
      return !!rating
    })

    return theme
  })

  foundUser.themes = await Promise.all(themes) */
  return foundUser
}
