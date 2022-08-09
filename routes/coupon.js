const express = require('express');
const router  = express.Router();
const couponController = require('../controller/couponController');

router.post("/" , couponController.addCoupon);
router.get("/" ,couponController.getCouponAll);
router.patch("/:id" , couponController.getCouponByID);
router.put("/" , couponController.updateCoupon);
router.delete("/:id" , couponController.delCoupon);

router.get("/chk/:id" ,couponController.chkCoupon);

module.exports = router;