const express = require('express');
const router = express.Router();
const infoController = require('../controller/userInformationController');

router.get("/" , infoController.getAddress);

module.exports = router;