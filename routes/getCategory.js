const express = require('express');
const router = express.Router();
const categoryCon = require('../controller/categoryController');

router.post('/' , categoryCon.getCateByID);

router.put('/' , categoryCon.updateCategory);

router.get("/" , categoryCon.getCategoryAll);

module.exports = router;