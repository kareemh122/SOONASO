const { body } = require("express-validator");
const upload = require("../config/multerCloudinary");

// --- Validation and sanitization rules for product creation and update ---
const productValidationRules = [
  upload.single("image"),

  body("serial_number")
    .notEmpty()
    .withMessage("Serial Number is required")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Serial number must be at most 100 characters"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be 1-100 characters"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Type must be at most 100 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage("Category must be at most 50 characters"),

  body("body_weight")
    .notEmpty()
    .withMessage("Body weight is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Body weight must be a positive number"),

  body("operating_weight")
    .notEmpty()
    .withMessage("Operating weight is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Operating weight must be a positive number"),

  body("overall_length")
    .notEmpty()
    .withMessage("Overall length is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Overall length must be a positive number"),

  body("overall_width")
    .notEmpty()
    .withMessage("Overall width is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Overall width must be a positive number"),

  body("overall_height")
    .notEmpty()
    .withMessage("Overall height is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Overall height must be a positive number"),

  body("required_oil_flow")
    .notEmpty()
    .withMessage("Required oil flow is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Required oil flow must be a positive number"),

  body("operating_pressure")
    .notEmpty()
    .withMessage("Operating pressure is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Operating pressure must be a positive number"),

  body("impact_rate")
    .notEmpty()
    .withMessage("Impact rate is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Impact rate must be a positive number"),

  body("impact_rate_soft_rock")
    .notEmpty()
    .withMessage("Impact Rate Soft Rock is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Impact Rate Soft Rock must be a positive number"),

  body("hose_diameter")
    .notEmpty()
    .withMessage("Hose diameter is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Hose diameter must be a positive number"),

  body("rod_diameter")
    .notEmpty()
    .withMessage("Rod Diameter is required")
    .bail()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Rod Diameter must be a positive number"),

  body("applicable_carrier")
    .notEmpty()
    .withMessage("Applicable carrier is required")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Applicable carrier must be at most 100 characters"),

  body("purchase_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Purchase date must be a valid date")
    .toDate(),

  body("warranty_start")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Warranty start must be a valid date")
    .toDate(),

  body("warranty_end")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Warranty end must be a valid date")
    .toDate(),

  body("owner_id")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Owner ID must be a positive integer")
    .toInt(),
];

module.exports = { productValidationRules };
