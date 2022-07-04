const express = require('express');
const router = express.Router();
const promotionController = require('../controller/promotionController');

router.post("/" , promotionController.addPromotion);
router.get("/" , promotionController.getPromotionAll);
router.patch("/:id" , promotionController.getPromotionByID);
router.put("/" , promotionController.updatePromotion);
router.delete("/:id" , promotionController.delPromotion);


module.exports = router;