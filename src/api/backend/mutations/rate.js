import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token, id, value}, {Session, Theme, Rating, User}) => {
  const {user} = await mustAuthenticate(token, Session)
  const theme = await Theme.findOne({
    '_id': id
  }, {
    'populate': true
  })

  if (!theme) {
    throw new Error('No theme found')
  }

  const existing = await Rating.findOne({
    'user': user._id
  })

  if (existing) {
    existing.value = value

    await existing.save()
  } else {
    const newRating = Rating.create({
      user,
      theme,
      value
    })

    await newRating.save()
  }

  const savedTheme = await theme.save()
  const rates = []

  savedTheme.ratings.forEach((rating, index) => {
    rates.push(Rating.findOne({
      '_id': rating._id
    }))
  })
  savedTheme.ratings = await Promise.all(rates)

  return savedTheme
}
