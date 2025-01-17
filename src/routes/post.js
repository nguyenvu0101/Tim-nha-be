const express = require('express')
const {
  editPost,
  viewEditPost,
  viewPost,
  deletePost,
  createPost,
  listPost,
  filterPricePost,
  filterAreaPost,
  filterLocationPost,
} = require('../app/controllers/postController')
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require('../app/controllers/verifyToken')
const router = express.Router()

router.put('/edit/:id/:postid', verifyTokenAndUserAuthorization, editPost)
router.get('/view/:postid', viewPost)
router.get('/view/:id/:postid', verifyTokenAndUserAuthorization ,viewEditPost)
router.delete('/delete/:id/:idpost',verifyTokenAndUserAuthorization , deletePost)
router.get('/list', listPost)
router.get('/filter-price-post', filterPricePost)
router.get('/filter-area-post', filterAreaPost)
router.get('/filter-location-post', filterLocationPost)
router.post('/:id', verifyTokenAndUserAuthorization , createPost)

module.exports = router
