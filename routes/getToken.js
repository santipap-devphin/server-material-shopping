const express = require('express');
const router = express.Router();
const genAccessToken = require('../controller/genToken');

router.get('/' , genAccessToken.generateAccessToken);

module.exports = router;