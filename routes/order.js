const router = require('express').Router()

const {isAdmin,isSignedIn,isAuthenticated,isSeller} = require('../controllers/auth')
const {getUserById} = require('../controllers/user')
const {getOrderById,getAOrder,getOrders,getAllOrderStatus,getPlacedOrders,createOrder,sendConfimationMail,sendCancellationMail,updateOrderStatus,deleteOrder, updateOrdersProductStatus} = require('../controllers/order')

router.param('orderId',getOrderById)
router.param('userId',getUserById)

router.get('/order/:orderId/:userId',isSignedIn,isAuthenticated,getAOrder);
router.get('/orders/:userId',isSignedIn,isAuthenticated,getOrders)
router.get('/order/all/status',isSignedIn,isAuthenticated,isSeller,getAllOrderStatus)
router.get('/order/all/:userId',isSignedIn,isAuthenticated,isSeller,getPlacedOrders)

router.post('/order/create/:userId',isSignedIn,createOrder,sendConfimationMail)
// router.put('/order/update/:orderId/:userId',updateOrder)
router.put('/order/status/:userId',isSignedIn,isAuthenticated,isSeller,updateOrderStatus)
router.put('/order/product/status/:orderId/:userId',isSignedIn,isAuthenticated,updateOrdersProductStatus)
router.delete('/order/delete/:orderId/:userId',isSignedIn,isAuthenticated,deleteOrder,sendCancellationMail)

module.exports = router