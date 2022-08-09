const express = require('express');
const router  =  express.Router();
const userController = require("../controller/userController");

router.get("/" , userController.userProfile);
router.get("/per/:id" , userController.userProfileByID);

module.exports = router;