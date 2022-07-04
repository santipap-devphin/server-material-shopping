const express = require('express');
const router = express.Router();
const supplyController = require('../controller/supplyController');

router.post("/" , supplyController.addSupply);
router.get("/" , supplyController.getSupplyAll);
router.patch("/:id" , supplyController.getSupplyByID);
router.put("/" , supplyController.updateSupply);
router.delete("/:id" , supplyController.delSupply);

module.exports = router;