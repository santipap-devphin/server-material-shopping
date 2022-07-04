const express = require('express');
const router = express.Router();
const gBcrypt  = require('../controller/getBcrypt');

router.get("/" , gBcrypt.genBcrypt);

module.exports = router;