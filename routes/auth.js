const router = require('express').Router()
const {loginUser,registerUser,logout} = require('../controllers/auth')

router.post('/login',loginUser)

router.post('/register',registerUser)

router.get('/logout',logout)

module.exports = router