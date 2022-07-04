const express = require('express');
const router = express.Router();
const categoryCon = require('../controller/categoryController');

router.post("/" , categoryCon.addCategory);

module.exports = router;