const authController = require('../app/controllers/authController')

const router = require('express').Router()
const { verifyToken } = require('../app/controllers/verifyToken')

//REGISTER
router.post('/register', authController.registerUser)
//LOG IN
router.post('/login', authController.loginUser)
//LOG OUT
router.post('/logout', verifyToken, authController.logOut)
//REFRESH TOKEN
router.post('/refresh', authController.requestRefreshToken)
module.exports = router
