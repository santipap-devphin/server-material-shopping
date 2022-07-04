const express = require('express');
const router  =  express.Router();
const userController = require("../controller/userController");

router.get("/" , userController.userProfile);

module.exports = router;