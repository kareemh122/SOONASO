const express = require("express");
const {
  getAllProducts,
  getFilteredProducts,
  createProduct,
  getProductById,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");
const { productValidationRules } = require("../middlewares/productValidation");
const { checkImageFile } = require("../middlewares/checkImageFile");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.get("/", getAllProducts);

router.get("/filter", getFilteredProducts);

router.get("/:id", getProductById);

router.post("/",
  productValidationRules,
  checkImageFile,   
  validateRequest,
  createProduct
);

router.put(
  "/:id",
  productValidationRules,
  checkImageFile,
  validateRequest,
  editProduct
);

router.delete("/:id", deleteProduct);

module.exports = router;
