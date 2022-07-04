const express = require('express');
const router = express.Router();
const userControler = require('../controller/userController');

router.post("/" , userControler.userRegister);

module.exports = router;