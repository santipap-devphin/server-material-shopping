const express = require('express');
const router = express.Router();
const productController  = require('../controller/productController');

router.post("/" , productController.addProduct);
router.get("/" , productController.getProductAll);
router.patch("/:id" , productController.getProductByID);
router.put("/" , productController.updateProduct);
router.delete("/:id" , productController.delProduct);

module.exports = router;