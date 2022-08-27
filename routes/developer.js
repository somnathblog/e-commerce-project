const router = require('express').Router()
const {isDeveloper,isSignedIn} = require('../controllers/auth')
const {getCustomerById,getAllUsers ,getSingleUser, findAndUpdatelInfo, searchUser, getUserById,findAndDeleteAccount} = require('../controllers/user')
const {getAddressById,updateAddress,deleteAddress,getAddress} = require('../controllers/address')
const { getProductById,createProduct,updateProduct,deleteProduct } = require('../controllers/product')
const {getOrderById,getAllOrderStatus,getPlacedOrders,sendCancellationMail,updateOrderStatus,deleteOrder} = require('../controllers/order')
const { getCategoryById,getAllCategories,getACategory,createCategory,updateCategory,deleteCategory } = require('../controllers/category')


router.param('orderId',getOrderById)
router.param('userId',getUserById)
router.param('customerId',getCustomerById)
router.param('addressId',getAddressById)
router.param('productId',getProductById)
router.param('categoryId',getCategoryById)


// User CRUD's
router.get('/developer/customers/:userId',isDeveloper,getAllUsers)
router.get('/developer/customer/:userId',isDeveloper,getSingleUser)
router.put('/developer/customer/edit/:customerId/:userId',isSignedIn,isDeveloper,findAndUpdatelInfo)
router.delete('/developer/customer/close/:customerId/:userId',isSignedIn,isDeveloper,findAndDeleteAccount)
router.get('/developer/search/:userId',isDeveloper,searchUser)

// Address CRUD's
router.get('/developer/address/:addressId',isDeveloper,getAddress)
router.put('/developer/address/edit/:addressId/:userId',isSignedIn,isDeveloper,updateAddress)
router.delete('/developer/address/delete/:addressId/:userId',isSignedIn,isDeveloper,deleteAddress)

// Product CRUD's
router.post('/developer/product/create/:userId',isSignedIn,isDeveloper,createProduct)
router.put('/developer/product/update/:productId/:userId',isSignedIn,isDeveloper,updateProduct)
router.delete('/developer/product/delete/:productId/:userId',isSignedIn,isDeveloper,deleteProduct)

// Order CRUD's
router.get('/developer/order/all/status/:userId',isDeveloper,getAllOrderStatus)
router.get('/developer/order/all/:userId',isDeveloper,getPlacedOrders)
router.put('/developer/order/status/:userId',isSignedIn,isDeveloper,updateOrderStatus)
router.delete('/developer/order/delete/:orderId/:userId',isSignedIn,isDeveloper,deleteOrder,sendCancellationMail)

// Category CRUD's
router.get('/developer/categories',getAllCategories)
router.get('/developer/category/:categoryId',getACategory)
router.post('/developer/category/create/:userId',isSignedIn,isDeveloper,createCategory);
router.put('/developer/category/update/:categoryId/:userId',isSignedIn,isDeveloper,updateCategory)
router.delete('/developer/category/delete/:categoryId/:userId',isSignedIn,isDeveloper,deleteCategory)


module.exports = router