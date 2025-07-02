const express = require("express");
const {
  getAllProducts,
  getFilteredProducts,
  createProduct,
} = require("../controllers/productController");
const { productValidationRules } = require("../middlewares/productValidation");
const validateRequest = require("../middlewares/validateRequest");
const { checkImageFile } = require("../middlewares/checkImageFile");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/filter", getFilteredProducts);
router.post("/", productValidationRules, checkImageFile, validateRequest, createProduct);

module.exports = router;
