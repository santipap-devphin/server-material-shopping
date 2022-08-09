const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');

router.post("/" ,blogController.addBlogs);
router.get("/" ,blogController.getBlogs);
router.get("/front/:id" ,blogController.getBlogforFrontend);
router.get("/taggroup/:slug" ,blogController.getTagGroup);
router.get("/slugs/:id" ,blogController.getBlogForSlug);
router.patch("/:id" ,blogController.getBlogByID);
router.put("/" ,blogController.updateBlog);
router.delete("/:id" ,blogController.delBlog);


module.exports = router;