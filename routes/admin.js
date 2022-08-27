const router = require('express').Router()
const {isAdmin,isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getCustomerById,getAllUsers ,getSingleUser, findAndUpdatelInfo, searchUser, getUserById,findAndDeleteAccount} = require('../controllers/user')
const {getAddressById,updateAddress,deleteAddress,getAddress} = require('../controllers/address')
const { getProductById,createProduct,updateProduct,deleteProduct } = require('../controllers/product')
const {getOrderById,getAllOrderStatus,getPlacedOrders,sendCancellationMail,updateOrderStatus,deleteOrder} = require('../controllers/order')

router.param('orderId',getOrderById)
router.param('userId',getUserById)
router.param('customerId',getCustomerById)
router.param('addressId',getAddressById)
router.param('productId',getProductById)

// User CRUD's
router.get('/admin/customers/:userId',isAdmin,getAllUsers)
router.get('/admin/customer/:userId',isAdmin,getSingleUser)
router.put('/admin/customer/edit/:customerId/:userId',isSignedIn,isAdmin,findAndUpdatelInfo)
router.delete('/admin/customer/close/:userId',isSignedIn,isAdmin,findAndDeleteAccount)
router.get('/admin/search',isSignedIn,isAdmin,searchUser)

// Address CRUD's
router.get('/admin/address/:addressId',isAdmin,getAddress)
router.put('/admin/address/edit/:addressId/:userId',isSignedIn,isAdmin,updateAddress)
router.delete('/admin/address/delete/:addressId/:userId',isSignedIn,isAdmin,deleteAddress)

// Product CRUD's
// router.post('/product/create/:userId',isSignedIn,isAuthenticated,isAdmin,createProduct)
router.put('/admin/product/update/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,updateProduct)
router.delete('/admin/product/delete/:productId/:userId',isSignedIn,isAuthenticated,isAdmin,deleteProduct)

// Order CRUD's
router.get('/admin/order/all/status/:userId',isAdmin,getAllOrderStatus)
router.get('/admin/order/all/:userId',isAdmin,getPlacedOrders)
router.put('/admin/order/status/:userId',isSignedIn,isAdmin,updateOrderStatus)
router.delete('/admin/order/delete/:orderId/:userId',isSignedIn,isAdmin,deleteOrder,sendCancellationMail)

module.exports = router