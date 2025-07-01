const express = require("express");
const {
  getAllProducts,
  getFilteredProducts,
  createProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/filter", getFilteredProducts);
router.post("/", createProduct);

module.exports = router;
