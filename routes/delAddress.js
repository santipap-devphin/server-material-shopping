const express = require('express');
const router = express.Router();
const infoController = require('../controller/userInformationController');

router.delete("/" , infoController.delAddress);
module.exports = router;