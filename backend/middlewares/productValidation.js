const { body } = require("express-validator");
const upload = require("../config/multerCloudinary");

// --- Validation and sanitization rules for product creation ---
const productValidationRules = [
  upload.single("image"),
  body("serial_number")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Invalid serial number"),
  body("name")
    .trim()
    .escape()
    .isLength({ min: 1, max: 255 })
    .withMessage("Product name required"),
  body("type")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Invalid type"),
  body("category")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Invalid category"),
  body("body_weight").toFloat(),
  body("operating_weight").toFloat(),
  body("overall_length").toFloat(),
  body("overall_width").toFloat(),
  body("overall_height").toFloat(),
  body("required_oil_flow").toFloat(),
  body("operating_pressure").toFloat(),
  body("impact_rate").toFloat(),
  body("impact_rate_soft_rock").toFloat(),
  body("hose_diameter").toFloat(),
  body("rod_diameter").toFloat(),
  body("applicable_carrier")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Invalid carrier info"),
  body("purchase_date").isISO8601().toDate(),
  body("warranty_start").isISO8601().toDate(),
  body("warranty_end").isISO8601().toDate(),
  body("owner_id").toInt(),
];

module.exports = { productValidationRules };
