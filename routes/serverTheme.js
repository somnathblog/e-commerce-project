const router = require('express').Router()

const { getUserById } = require('../controllers/user')
const { isSignedIn,isAuthenticated,isDeveloper } = require('../controllers/auth')
const { getThemeById,getCurrentTheme,createTheme,changeTheme,clearTheme,getAllTheme } = require('../controllers/serverTheme')

router.param('themeId',getThemeById)
router.param('userId',getUserById)

router.get('/theme/current/:themeId',getCurrentTheme)
router.get('/themes',getAllTheme)
router.post('/theme/add/:userId',isSignedIn,isAuthenticated,isDeveloper,createTheme)
router.put('/theme/change/:themeId/:userId',isSignedIn,isAuthenticated,isDeveloper,changeTheme)
router.delete('/theme/remove/:themeId/:userId',isSignedIn,isAuthenticated,isDeveloper,clearTheme)

module.exports = router