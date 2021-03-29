const express = require('express');
const {getAllBlogs, 
  createBlog, 
  blogByMember, 
  blogById, 
  isBlogAuthor, 
  updateBlog, 
  deleteBlog,
  blogImage,
  blog,
  answer
} = require('../controllers/blog');
const { isLoggedin } = require('../controllers/member');
const { memberById } = require('../controllers/member');

const router = express.Router();

// route to get all blogs
router.get('/blog/all', getAllBlogs);

// routes for blog answers/comments
router.put('/blog/answer', isLoggedin, answer);

// route to create new blog
router.post('/blog/new/:memberId', isLoggedin, createBlog);

// router for get blogs by user
router.get('/blog/by/:memberId', blogByMember);

// route to get a single post
router.get('/blog/:blogId', blog);

// router for update method
router.put('/blog/:blogId', isLoggedin, isBlogAuthor, updateBlog)

//router for delete blogs. 
router.delete('/blog/:blogId', isLoggedin, isBlogAuthor, deleteBlog)

// route for blog image 
router.get("/blog/image/:blogId", blogImage);

router.param("memberId", memberById);
router.param("blogId", blogById)


module.exports = router;