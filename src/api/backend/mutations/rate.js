import mustAuthenticate from '../../../shared/enforce-session'

export default async (root, {token, id, value}, {Session, Theme, Rating, User}) => {
  const {user} = await mustAuthenticate(token, Session)
  const theme = await Theme.findOne({
    '_id': id
  }, {
    'populate': true
  })

  // Sanity checks
  if (!theme) {
    throw new Error('No theme found')
  }

  user.themes = await Theme.find({
    'user': user._id
  })

  user.themes.forEach((userTheme) => {
    if (userTheme._id.equals(id)) {
      throw new Error('You can\'t rate your own themes')
    }
  })

  // Load the existing rating object
  let existing = await Rating.findOne({
    'theme': theme._id,
    'user':  user._id
  })

  if (existing) {
    // If we found an existing rating, update it
    existing.value = value
    existing.theme = theme
  } else {
    // Otherwise, create a new one
    existing = Rating.create({
      user,
      theme,
      value
    })
  }

  const ratings = []

  theme.ratings.forEach((rating) => {
    if (rating && !rating._id.equals(existing._id)) {
      ratings.push(rating)
    }
  })

  // Push the new reference into the theme object
  ratings.push(existing)

  theme.ratings = ratings
  await existing.save()

  const savedTheme = await theme.save()
  const rates = savedTheme.ratings.map((rating) => Rating.findOne({
    '_id': rating._id
  }))

  savedTheme.ratings = await Promise.all(rates)
  return savedTheme
}
