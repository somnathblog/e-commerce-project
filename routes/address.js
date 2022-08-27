const router = require('express').Router()

const {isSignedIn,isAuthenticated} = require('../controllers/auth')
const { getUserById } = require('../controllers/user')
const {getAddressById,createAddress,getAddress,updateAddress,deleteAddress} = require('../controllers/address')

router.param("userId",getUserById)
router.param("addressId",getAddressById)

router.post('/address/create',createAddress)
router.get('/address/:addressId',getAddress)
router.put('/address/edit/:addressId/:userId',isSignedIn,isAuthenticated,updateAddress)
router.delete('/address/delete/:addressId/:userId',isSignedIn,isAuthenticated,deleteAddress)

module.exports = router