const router = require('express').Router()

const {isSignedIn,isAuthenticated,isSeller} = require('../controllers/auth')
const { getUserById } = require('../controllers/user')
const {getProductById,createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct,getProductPhotos,searchProduct, getIndivisualProductPhoto,getProductsByCategory} = require('../controllers/product')

router.param('productId',getProductById)
router.param('userId',getUserById)

router.post('/product/create/:userId',isSignedIn,isAuthenticated,isSeller,createProduct)
router.get('/products',getAllProducts)
router.get('/products/category',getProductsByCategory)
router.get('/product/:productId',getSingleProduct)
router.put('/product/update/:productId/:userId',isSignedIn,isAuthenticated,isSeller,updateProduct)
router.delete('/product/delete/:productId/:userId',isSignedIn,isAuthenticated,isSeller,deleteProduct)

router.get('/product/photo/:productId',getProductPhotos)
router.get('/product/single/photo/:productId',getIndivisualProductPhoto)
router.get('/products/search',searchProduct)

module.exports = router