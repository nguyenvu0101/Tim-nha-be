const axios = require('axios')
const crypto = require('crypto')
const User = require('../models/User')
const payMent = {
  // Hàm async bao quanh đoạn code
  createPayment: async (req, res) => {
    const { amount, orderInfo, userId, membershipLevel } = req.body
    // Các thông số cần thiết
    const accessKey = 'F8BBA842ECF85'
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
    // var orderInfo = 'pay with MoMo'
    const partnerCode = 'MOMO'
    const redirectUrl = 'http://localhost:3003/post'
    const ipnUrl =
      'https://49e2-2402-800-61cf-704b-e1b8-f018-d27-90a6.ngrok-free.app/payment/ipn'
    var requestType = 'payWithMethod'
    // var amount = '50000'
    const orderId = partnerCode + new Date().getTime()
    const requestId = orderId
    const extraData = Buffer.from(
      JSON.stringify({ userId, membershipLevel }) // Chuyển thông tin vào extraData
    ).toString('base64') // Mã hóa base64
    const orderGroupId = ''
    const autoCapture = true
    const lang = 'vi'

    // Tạo raw signature
    const rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType

    // Log raw signature
    console.log('--------------------RAW SIGNATURE----------------')
    console.log(rawSignature)

    // Tạo chữ ký HMAC SHA256
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')

    // Log signature
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)

    // Tạo object JSON gửi đến MoMo
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    })

    // Cấu hình cho yêu cầu HTTPS
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
      data: requestBody,
    }

    // Gửi yêu cầu và xử lý kết quả
    try {
      const result = await axios(options)
      return res.status(200).json(result.data) // Trả kết quả từ MoMo về client
    } catch (error) {
      // Xử lý lỗi nếu có
      return res.status(500).json({
        statusCode: 500,
        message: 'Lỗi server',
      })
    }
  },
  handleIpn: async (req, res) => {
    try {
      console.log('Đã nhận thông báo IPN:', req.body)

      const ipnData = req.body

      // Lấy chữ ký và loại bỏ nó khỏi dữ liệu để kiểm tra
      const { signature, ...dataWithoutSignature } = ipnData

      // Tạo raw signature để kiểm tra tính hợp lệ của dữ liệu
      const rawSignature =
        `accessKey=${dataWithoutSignature.accessKey}&` +
        `amount=${dataWithoutSignature.amount}&` +
        `extraData=${dataWithoutSignature.extraData}&` +
        `ipnUrl=${dataWithoutSignature.ipnUrl}&` +
        `orderId=${dataWithoutSignature.orderId}&` +
        `orderInfo=${dataWithoutSignature.orderInfo}&` +
        `partnerCode=${dataWithoutSignature.partnerCode}&` +
        `redirectUrl=${dataWithoutSignature.redirectUrl}&` +
        `requestId=${dataWithoutSignature.requestId}&` +
        `requestType=${dataWithoutSignature.requestType}`

      // Tạo chữ ký từ dữ liệu nhận được
      const generatedSignature = crypto
        .createHmac('sha256', 'K951B6PE1waDMi640xX08PD3vg6EkVlz') // secretKey của bạn
        .update(rawSignature)
        .digest('hex')

      // // Kiểm tra chữ ký có hợp lệ không
      // if (signature !== generatedSignature) {
      //   console.log('Chữ ký không hợp lệ')
      //   return res.status(400).json({
      //     statusCode: 400,
      //     message: 'Chữ ký không hợp lệ',
      //   })
      // }

      // Kiểm tra trạng thái thanh toán (resultCode == 0 có nghĩa là thanh toán thành công)
      if (ipnData.resultCode === 0) {
        // Giải mã extraData (mã hóa Base64)
        let extraData = null
        try {
          extraData = JSON.parse(
            Buffer.from(ipnData.extraData, 'base64').toString()
          )
        } catch (err) {
          console.error('Lỗi giải mã extraData:', err)
          return res.status(400).json({
            statusCode: 400,
            message: 'Lỗi giải mã extraData',
          })
        }

        const { userId, membershipLevel } = extraData

        // Cập nhật giá trị membershipLevel trong cơ sở dữ liệu
        const user = await User.findById(userId)
        if (user) {
          user.membership = membershipLevel
          await user.save()

          // Trả về thông báo thành công
          console.log(`Cập nhật membership thành công cho user ${userId}`)
          return res.status(200).json({
            statusCode: 200,
            message: 'Thanh toán thành công, cập nhật membership thành công',
          })
        } else {
          console.log('Không tìm thấy người dùng với ID:', userId)
          return res.status(404).json({
            statusCode: 404,
            message: 'Người dùng không tồn tại',
          })
        }
      } else {
        // Trả về thông báo nếu thanh toán không thành công
        console.log('Thanh toán thất bại:', ipnData.resultMessage)
        return res.status(400).json({
          statusCode: 400,
          message: 'Thanh toán thất bại',
        })
      }
    } catch (error) {
      console.error('Lỗi khi xử lý IPN:', error)
      return res.status(500).json({
        statusCode: 500,
        message: 'Lỗi khi xử lý IPN',
      })
    }
  },
}
module.exports = payMent
