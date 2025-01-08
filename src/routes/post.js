const express = require('express')
const { createPost, listPost } = require('../app/controllers/postController')
const router = express.Router()

router.get('/list', listPost)
router.post('/', createPost)

module.exports = router
