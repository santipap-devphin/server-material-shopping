const express = require('express');
const router = express.Router();
const getAll = require('../controller/userController');

router.get("/" , getAll.getUser)

module.exports = router;