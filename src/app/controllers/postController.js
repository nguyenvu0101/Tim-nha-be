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
    const posts = await Post.find() // Tìm tất cả bài đăng
    res.status(200).json(posts) // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}

const deletePost = async (req, res) => {
  try {
    const posts = await Post.findByIdAndDelete(req.params.idpost) // Tìm tất cả bài đăng
    res.status(200).json(posts) // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}

const filterPricePost = async (req, res) => {
  const { minPrice = 0, maxPrice = Infinity } = req.query

  try {
    // Lấy bài đăng theo khoảng giá
    const posts = await Post.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
const filterAreaPost = async (req, res) => {
  const { minArea = 0, maxArea = Infinity } = req.query

  try {
    // Lấy bài đăng theo khoảng giá
    const posts = await Post.find({
      area: { $gte: parseFloat(minArea), $lte: parseFloat(maxArea) },
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
const filterLocationPost = async (req, res) => {
  try {
    const { province, district } = req.query
    const query = {}
    if (province) query.province = province
    if (district) query.district = district

    const posts = await Post.find(query)
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lọc bài đăng' })
  }
}
const viewPost = async (req, res) => {
  try {
    const posts = await Post.findById(req.params.postid) // Tìm tất cả bài đăng
    res.status(200).json(posts) // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}
const editPost = async (req, res) => {
  const updateData = req.body
  try {
    const posts = await Post.findByIdAndUpdate(req.params.postid, updateData, {
      new: true,
    }) // Tìm tất cả bài đăng
    res.status(200).json(posts)
    console.log('abc') // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error.message)
    res.status(500).json({ message: 'Lỗi server!' })
  }
}

module.exports = {
  editPost,
  viewPost,
  deletePost,
  createPost,
  listPost,
  filterPricePost,
  filterAreaPost,
  filterLocationPost,
}
