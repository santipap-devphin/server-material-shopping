const express = require('express');
const router = express.Router();
const infoController = require('../controller/userInformationController');

router.post("/" , infoController.changePassword)

module.exports = router;