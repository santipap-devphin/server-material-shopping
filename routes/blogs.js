const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

router.post("/" ,blogController.addBlogs);
router.get("/" ,blogController.getBlogs);
router.patch("/:id" ,blogController.getBlogByID);
router.put("/" ,blogController.updateBlog);
router.delete("/:id" ,blogController.delBlog);

module.exports = router;