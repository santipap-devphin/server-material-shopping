const express = require('express');
const router  = express.Router();
const paymentController = require('../controller/paymentController');

router.post("/" , paymentController.addPayment);
router.patch("/:id" , paymentController.getPaymentByID);
router.put("/" , paymentController.updatePayment);
router.get("/" , paymentController.getPaymentAll);
router.delete("/:id" , paymentController.delPayment);
module.exports = router;
