const express = require('express');
const router = express.Router();
const MessageController = require('../controller/MessageController');

router.get("/:id" , MessageController.getMsgUserByID);
router.patch("/" , MessageController.getMessageUserAll);
router.post("/" , MessageController.reqMsgUserForAdmin)


module.exports = router;