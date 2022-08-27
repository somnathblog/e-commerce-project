const router = require('express').Router()
const {getUserById} = require('../controllers/user')
const {getContactById,clearContact,updateContact,recordContact,getAContact,getAllContact} = require('../controllers/contact')
const {isSignedIn , isAdmin} = require('../controllers/auth')

router.param("userId",getUserById)
router.param("problemId",getContactById)


router.get("/contact/:userId",isSignedIn,isAdmin,getAllContact)
router.get("/contact/:problemId/:userId",isSignedIn,isAdmin,getAContact)

router.post("/contact/record",recordContact)

router.put("/contact/update/:problemId/:userId",isSignedIn,isAdmin,updateContact)

router.delete("/contact/clear/:problemId/:userId",isSignedIn,isAdmin,clearContact)


module.exports = router