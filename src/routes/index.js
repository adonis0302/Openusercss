import {Router as expressRouter} from 'express'

const router = expressRouter()

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  // req.flash('error_msg','You are not logged in');
  res.redirect('/users/login')
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index')
})

module.exports = router
