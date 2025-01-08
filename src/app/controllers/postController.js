// Post controller (createPost.js)

const Post = require('../models/Post') // Đảm bảo model được import đúng

const createPost = async (req, res) => {
  try {
    console.log('Dữ liệu nhận từ client:', req.body)
    // Tạo một bài đăng mới từ dữ liệu trong req.body
    const newPost = new Post(req.body)
    console.log('Dữ liệu cần lưu:', newPost)
    // Lưu bài đăng mới vào MongoDB
    await newPost.save()

    // Trả về phản hồi khi thành công
    res.status(201).json({
      message: 'Bài đăng đã được tạo thành công!',
    })
  } catch (error) {
    console.log(error)
    // Trả về phản hồi lỗi khi có sự cố
    res.status(500).json({
      message: 'Có lỗi xảy ra khi tạo bài đăng!',
      error: error.message, // Trả về thông tin lỗi chi tiết
    })
  }
}
const listPost = async (req, res) => {
  try {
    const posts = await Post.find(); // Tìm tất cả bài đăng
    res.status(200).json(posts); // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};
module.exports = { createPost , listPost}
