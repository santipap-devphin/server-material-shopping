const express = require('express');
const router = express.Router();

const reqRefreshToken = require('../controller/refreshTokenController');

router.get("/" , reqRefreshToken.handleRefreshToken);

module.exports = router;