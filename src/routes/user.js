const userController = require('../app/controllers/userController')
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require('../app/controllers/verifyToken')

const router = require('express').Router()
// router.put('/update-membership', userController.membershipUser)
//GET ALL USERS
router.get('/allUser', verifyTokenAndAdmin, userController.getAllUsers)
//GET USER
router.get('/info/:id', verifyTokenAndUserAuthorization, userController.getUser)
//Update User 
router.put('/update/:id', verifyTokenAndUserAuthorization, userController.updateUser)
//DELETE USER
router.delete(
  '/delete/:id',
  verifyTokenAndUserAuthorization,
  userController.deleteUser
)

module.exports = router
