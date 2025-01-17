const User = require('../models/User')
const bcrypt = require('bcrypt')

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const allUser = await User.find()
      res.status(200).json(allUser)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.status(200).json(user)
    } catch (err){
       res.status(500).json(err)
    }
  },
  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id)
      res.status(200).json('User deleted')
    } catch (err) {
      res.status(500).json(err)
    }
  },
  
// membershipUser : async (req, res) => {
//   const { userId, membershipLevel } = req.body;
//   console.log(req.body);
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'Người dùng không tồn tại' });
//     }

//     // Cập nhật gói thành viên
//     user.membership = membershipLevel
//     await user.save();

//     res
//       .status(200)
//       .json({
//         message: 'Cập nhật gói thành viên thành công',
//         membership: membershipLevel,
//       })
//   } catch (error) {
//     res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error });
//   }
//   },
  updateUser: async (req, res) => {
     try {
       const userId = req.user.id // Lấy ID người dùng từ middleware authenticate
       const { currentPassword, newPassword } = req.body

       // Kiểm tra nếu thiếu trường nào
       if (!currentPassword || !newPassword) {
         return res
           .status(400)
           .json({ message: 'Vui lòng nhập đầy đủ thông tin.' })
       }

       // Lấy thông tin người dùng từ cơ sở dữ liệu
       const user = await User.findById(userId)
       if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại.' })
       }

       // Kiểm tra mật khẩu hiện tại
       const isMatch = await bcrypt.compare(currentPassword, user.password)
       if (!isMatch) {
         return res
           .status(400)
           .json({ message: 'Mật khẩu hiện tại không đúng.' })
       }

       // Mã hóa mật khẩu mới
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(newPassword, salt)

       // Cập nhật mật khẩu trong cơ sở dữ liệu
       user.password = hashedPassword
       await user.save()

       res.status(200).json({ message: 'Đổi mật khẩu thành công!' })
     } catch (error) {
       console.error('Lỗi đổi mật khẩu:', error)
       res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' })
     }
  }
}

module.exports = userController
