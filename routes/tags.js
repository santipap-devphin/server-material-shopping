const express = require('express');
const router = express.Router();
const tagsController = require('../controller/tagsController');

router.post("/" , tagsController.addTag)
router.get("/" , tagsController.getTagsAll);
router.patch("/:id" , tagsController.getTagsByID);
router.put("/" , tagsController.updateTags);
router.delete("/:id" , tagsController.delTags);

module.exports = router;