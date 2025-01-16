const express = require('express')
const { createPayment } = require('.././app/controllers/paymentControllers')

const router = express.Router()

// Route cho thanh toán
router.post('/create-payment', createPayment)

module.exports = router
