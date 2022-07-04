const express = require('express');
const router = express.Router();
const infoController = require("../controller/userInformationController");

router.post("/" , infoController.updateAddress);

module.exports = router;