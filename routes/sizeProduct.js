const express = require('express');
const router = express.Router();
const sizePrdController  = require('../controller/sizeProductController');

router.post("/" , sizePrdController.addSize) //insert
router.patch("/:id" , sizePrdController.getSizeByID) // fetchdata by id
router.get("/" , sizePrdController.getSizeProductAll); // get all data
router.put("/" , sizePrdController.updateSize); // update data
router.delete("/:id" , sizePrdController.delSize); // delete data

module.exports = router;