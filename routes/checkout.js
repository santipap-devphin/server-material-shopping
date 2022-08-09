const express = require('express');
const router = express.Router();
const checkoutController = require('../controller/checkoutController');

router.post("/add" , checkoutController.addCheckout);
router.get("/byuser/:id" ,checkoutController.getOrderCheckOutByUser);
router.patch("/updatenotify/:id" ,checkoutController.updateNotifyOrder);
router.patch("/updatecancel/:id" ,checkoutController.updateCancelOrder);
router.get("/alldata" , checkoutController.getCheckOutAll);
router.get("/profile/:id" , checkoutController.checkOutProfile);
router.put("/updatepayment" , checkoutController.updatePayment);
router.post("/addshipping" , checkoutController.addShipping);

module.exports = router;