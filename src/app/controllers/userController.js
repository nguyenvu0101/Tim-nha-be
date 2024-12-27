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
  

  updateUser: async (req, res) => {
    const hashPassword = async (password) => {
      const saltRounds = 10;  // Số vòng salt (càng cao, càng bảo mật nhưng chậm hơn)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    };
    try {
      // Nếu mật khẩu được cung cấp trong body, mã hóa nó
      if (req.body.password) {
        req.body.password = await hashPassword(req.body.password);  // Mã hóa mật khẩu
      }

      // Cập nhật thông tin người dùng, bao gồm cả mật khẩu đã mã hóa nếu có
      await User.findByIdAndUpdate(req.params.id, req.body);

      res.status(200).json('User updated');
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = userController
