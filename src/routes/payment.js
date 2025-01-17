const express = require('express')
const paymentController = require('../app/controllers/paymentController')
const router = express.Router()

// Route cho thanh toán
router.post('/ipn',paymentController.handleIpn)
router.post('/create-payment', paymentController.createPayment)

module.exports = router
