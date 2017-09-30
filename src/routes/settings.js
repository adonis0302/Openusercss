import {Router as expressRouter} from 'express'
import {newKeyHandler} from './handlers/new-key-handler'

const router = expressRouter()

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  req.flash('msg:error', 'Changing settings requires to be logged in')
  res.redirect('/users/login')
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('settings')
})

router.post('/reset-key', ensureAuthenticated, newKeyHandler)

module.exports = router
