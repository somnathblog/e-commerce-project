const router = require('express').Router()
const {getUserById,getUserInfo,editPersonalInfo,deleteAccount,getUserImage,pushOrderInPurchases} = require('../controllers/user')
const {isSignedIn,isAuthenticated} = require('../controllers/auth')

router.param('userId',getUserById)

router.get('/user/:userId',getUserInfo);
router.put('/user/edit/:userId',isSignedIn,isAuthenticated,editPersonalInfo);
router.delete('/user/close/:userId',isSignedIn,isAuthenticated,deleteAccount);
router.put('/user/pushorder/:userId',isSignedIn,pushOrderInPurchases)
router.get('/user/image/:userId',getUserImage)

module.exports = router