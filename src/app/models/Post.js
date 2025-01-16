const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  userId: String,
  province: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  numBedrooms: { type: Number, required: true },
  numBathrooms: { type: Number, required: true },
  contact: { type: String, required: true },
  amenities: {
    dieu_hoa: { type: Boolean, default: false },
    nong_lanh: { type: Boolean, default: false },
    may_giat: { type: Boolean, default: false },
    free_time: { type: Boolean, default: false },
    gac_xep: { type: Boolean, default: false },
    tu_lanh: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    thang_may: { type: Boolean, default: false },
    chung_chu: { type: Boolean, default: false },
  },
  images: [String],
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
