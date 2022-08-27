const router = require('express').Router()
const {isSeller,isSignedIn,isAuthenticated} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')
const { getProductById,createProduct,updateProduct,deleteProduct } = require('../controllers/product')
const {getOrderById,getPlacedOrders,sendCancellationMail,updateOrderStatus,deleteOrder, getAllOrderStatus} = require('../controllers/order')

router.param('orderId',getOrderById)
router.param('userId',getUserById)
router.param('productId',getProductById)

// Product CRUD's
router.post('/seller/product/create/:userId',isSignedIn,isAuthenticated,isSeller,createProduct)
router.put('/seller/product/update/:productId/:userId',isSignedIn,isAuthenticated,isSeller,updateProduct)
router.delete('/seller/product/delete/:productId/:userId',isSignedIn,isAuthenticated,isSeller,deleteProduct)

// Order CRUD's
router.get('/seller/order/all/status/:userId',isSeller,getAllOrderStatus)
router.get('/seller/order/all/:userId',isSeller,getPlacedOrders)
router.put('/seller/order/status/:userId',isSignedIn,isAuthenticated,isSeller,updateOrderStatus)
router.delete('/seller/order/delete/:orderId/:userId',isSignedIn,isAuthenticated,isSeller,deleteOrder,sendCancellationMail)

module.exports = router