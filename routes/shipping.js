const express = require('express');
const router = express.Router();
const shippingController = require('../controller/shippingController');

router.get("/all" , shippingController.getAllShipping);
router.put("/shippingproblem" , shippingController.updateShippingProbiem);
router.put("/updaterecheck" , shippingController.updateRecheck);

module.exports = router;
