const express = require('express');
const router = express.Router();
const categoryCon = require('../controller/categoryController');

router.get("/" , categoryCon.delCategory);

module.exports = router;