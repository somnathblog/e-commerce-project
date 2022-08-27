const router = require('express').Router()
const {getUserById} = require('../controllers/user')
const {getProblemById,getAllProblems,getAProblem,recordProblem,updateProblem,clearProblem} = require('../controllers/problem')
const {isSignedIn , isAdmin} = require('../controllers/auth')

router.param("userId",getUserById)
router.param("problemId",getProblemById)


router.get("/problems/:userId",isSignedIn,isAdmin,getAllProblems)
router.get("/problem/:problemId/:userId",isSignedIn,isAdmin,getAProblem)

router.post("/problem/record",recordProblem)

router.put("/problem/update/:problemId/:userId",isSignedIn,isAdmin,updateProblem)

router.delete("/problem/clear/:problemId/:userId",isSignedIn,isAdmin,clearProblem)


module.exports = router