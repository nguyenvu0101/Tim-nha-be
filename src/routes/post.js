const express = require('express')
const {
  createPost,
  listPost,
  filterPricePost,
  filterAreaPost,
  filterLocationPost,
  listUserPost,
} = require('../app/controllers/postController')

const router = express.Router()

router.get('/list', listPost)
router.get('/filter-price-post', filterPricePost)
router.get('/filter-area-post', filterAreaPost)
router.get('/filter-location-post', filterLocationPost)
router.post('/', createPost)

module.exports = router
