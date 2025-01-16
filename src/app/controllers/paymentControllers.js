const crypto = require('crypto')
const https = require('https')

const config = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  partnerCode: 'MOMO',
  redirectUrl: 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
  ipnUrl: 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
}

exports.createPayment = (req, res) => {
  const { amount, orderInfo } = req.body

  const orderId = config.partnerCode + new Date().getTime()
  const requestId = orderId
  const requestType = 'captureWallet'
  const extraData = ''

  // Tạo raw signature
  const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${requestType}`

  // Tạo chữ ký HMAC SHA256
  const signature = crypto
    .createHmac('sha256', config.secretKey)
    .update(rawSignature)
    .digest('hex')

  const requestBody = JSON.stringify({
    partnerCode: config.partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: config.redirectUrl,
    ipnUrl: config.ipnUrl,
    lang: 'vi',
    requestType,
    extraData,
    signature,
  })

  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  }

  const momoReq = https.request(options, (momoRes) => {
    let data = ''
    momoRes.on('data', (chunk) => {
      data += chunk
    })

    momoRes.on('end', () => {
      res.json(JSON.parse(data))
    })
  })

  momoReq.on('error', (error) => {
    console.error(`Error: ${error.message}`)
    res.status(500).json({ error: error.message })
  })

  momoReq.write(requestBody)
  momoReq.end()
}
