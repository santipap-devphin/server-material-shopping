const express = require('express');
const router = express.Router();
const checkUserForLogin = require('../controller/userController');

router.post("/" , checkUserForLogin.chkUserForLogin);

module.exports = router;
