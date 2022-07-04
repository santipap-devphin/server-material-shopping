const express = require('express');
const router = express.Router();
const refreshToken = require('../controller/genRefreshToken');

router.get("/" , refreshToken.genRefreshToken);

module.exports = router;