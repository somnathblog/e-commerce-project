const router = require('express').Router()

const { isSignedIn, isAuthenticated, isSeller } = require('../controllers/auth')
const { getCategoryById,getAllCategories,getACategory,createCategory,updateCategory,deleteCategory } = require('../controllers/category')
const { getUserById } = require('../controllers/user')


router.param('categoryId',getCategoryById)
router.param('userId',getUserById)

router.get('/categories',getAllCategories)
router.get('/category/:categoryId',getACategory)
router.post('/category/create/:userId',isSignedIn,isAuthenticated,isSeller,createCategory);
router.put('/category/update/:categoryId/:userId',isSignedIn,isAuthenticated,isSeller,updateCategory)
router.delete('/category/delete/:categoryId/:userId',isSignedIn,isAuthenticated,isSeller,deleteCategory)

module.exports = router