const db = require("../config/db");
const xss = require("xss");
const upload = require("../config/multerCloudinary");
const { body, validationResult } = require("express-validator");

const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
        SELECT p.*, o.full_name, o.company
        FROM products p
        LEFT JOIN owners o ON p.owner_id = o.id
        ORDER BY p.id DESC
      `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Filtered products endpoint
const getFilteredProducts = async (req, res, next) => {
  try {
    // Accept arrays for each filter
    let {
      category = [],
      type = [],
      operatingWeight = [],
      oilFlow = [],
      applicableCarrier = [],
    } = req.query;

    // Normalize to arrays
    if (!Array.isArray(category)) category = category ? [category] : [];
    if (!Array.isArray(type)) type = type ? [type] : [];
    if (!Array.isArray(operatingWeight))
      operatingWeight = operatingWeight ? [operatingWeight] : [];
    if (!Array.isArray(oilFlow)) oilFlow = oilFlow ? [oilFlow] : [];
    if (!Array.isArray(applicableCarrier))
      applicableCarrier = applicableCarrier ? [applicableCarrier] : [];

    let query = `SELECT p.*, o.full_name, o.company FROM products p LEFT JOIN owners o ON p.owner_id = o.id WHERE 1=1`;
    const params = [];

    if (category.length) {
      query += ` AND p.category IN (${category.map(() => "?").join(",")})`;
      params.push(...category);
    }
    if (type.length) {
      query += ` AND p.type IN (${type.map(() => "?").join(",")})`;
      params.push(...type);
    }
    // Operating Weight filter (multi-range)
    if (operatingWeight.length) {
      query +=
        " AND (" +
        operatingWeight
          .map((val) => {
            switch (val) {
              case "~500kg":
                return "p.operating_weight_kg <= 500";
              case "500-1400kg":
                return "p.operating_weight_kg > 500 AND p.operating_weight_kg <= 1400";
              case "1400-2000kg":
                return "p.operating_weight_kg > 1400 AND p.operating_weight_kg <= 2000";
              case "2000-3000kg":
                return "p.operating_weight_kg > 2000 AND p.operating_weight_kg <= 3000";
              case "3000-5000kg":
                return "p.operating_weight_kg > 3000 AND p.operating_weight_kg <= 5000";
              case "5000kg+":
                return "p.operating_weight_kg > 5000";
              default:
                return "1=0";
            }
          })
          .join(" OR ") +
        ")";
    }
    // Oil Flow filter (multi-range)
    if (oilFlow.length) {
      query +=
        " AND (" +
        oilFlow
          .map((val) => {
            switch (val) {
              case "~35l/min":
                return "p.required_oil_flow_lpm <= 35";
              case "35-55l/min":
                return "p.required_oil_flow_lpm > 35 AND p.required_oil_flow_lpm <= 55";
              case "55-70l/min":
                return "p.required_oil_flow_lpm > 55 AND p.required_oil_flow_lpm <= 70";
              case "70-95/min":
                return "p.required_oil_flow_lpm > 70 AND p.required_oil_flow_lpm <= 95";
              case "95-165l/min":
                return "p.required_oil_flow_lpm > 95 AND p.required_oil_flow_lpm <= 165";
              case "165/min+":
                return "p.required_oil_flow_lpm > 165";
              default:
                return "1=0";
            }
          })
          .join(" OR ") +
        ")";
    }
    // Applicable Carrier filter (multi-range)
    if (applicableCarrier.length) {
      query +=
        " AND (" +
        applicableCarrier
          .map((val) => {
            switch (val) {
              case "~5ton":
                return "p.applicable_carrier_si REGEXP '(^|[^0-9])([0-5])([^0-9]|$)'";
              case "5-14ton":
                return "p.applicable_carrier_si REGEXP '([5-9]|1[0-4])ton'";
              case "14-20ton":
                return "p.applicable_carrier_si REGEXP '(1[4-9]|20)ton'";
              case "20-30ton":
                return "p.applicable_carrier_si REGEXP '(2[0-9]|30)ton'";
              case "30-50ton":
                return "p.applicable_carrier_si REGEXP '(3[0-9]|4[0-9]|50)ton'";
              case "50+ton":
                return "p.applicable_carrier_si REGEXP '(5[0-9]|[6-9][0-9]|[1-9][0-9]{2,})ton'";
              default:
                return "1=0";
            }
          })
          .join(" OR ") +
        ")";
    }
    query += " ORDER BY p.id DESC";
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

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
  body("body_weight").optional({ checkFalsy: true }).toFloat(),
  body("operating_weight").optional({ checkFalsy: true }).toFloat(),
  body("overall_length").optional({ checkFalsy: true }).toFloat(),
  body("overall_width").optional({ checkFalsy: true }).toFloat(),
  body("overall_height").optional({ checkFalsy: true }).toFloat(),
  body("required_oil_flow").optional({ checkFalsy: true }).toFloat(),
  body("operating_pressure").optional({ checkFalsy: true }).toFloat(),
  body("impact_rate").optional({ checkFalsy: true }).toFloat(),
  body("impact_rate_soft_rock").optional({ checkFalsy: true }).toFloat(),
  body("hose_diameter").optional({ checkFalsy: true }).toFloat(),
  body("rod_diameter").optional({ checkFalsy: true }).toFloat(),
  body("applicable_carrier")
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage("Invalid carrier info"),
  body("purchase_date").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("warranty_start").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("warranty_end").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("owner_id").optional({ checkFalsy: true }).toInt(),
];

// --- Controller to handle product creation with image upload and secure input validation ---
const createProduct = [
  ...productValidationRules,
  async (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // Extract sanitized fields in DB order
      const fields = [
        "serial_number",
        "name",
        "type",
        "category",
        "body_weight",
        "operating_weight",
        "overall_length",
        "overall_width",
        "overall_height",
        "required_oil_flow",
        "operating_pressure",
        "impact_rate",
        "impact_rate_soft_rock",
        "hose_diameter",
        "rod_diameter",
        "applicable_carrier",
        "owner_id",
        "purchase_date",
        "warranty_start",
        "warranty_end",
      ];
      // Build params array in correct order, sanitize all string fields with xss
      const params = fields.map((f) => {
        let val = req.body[f] !== undefined ? req.body[f] : null;
        // Only sanitize string fields
        if (typeof val === "string") val = xss(val.trim());

        return val;
      });
      // Insert Cloudinary image URL at correct position (after category)
      let imageUrl = req.file ? xss(req.file.path) : null;
      if (typeof imageUrl === "string") imageUrl = imageUrl.slice(0, 512); // limit path length
      params.splice(4, 0, imageUrl); // image_url after category
      // If no owner, set owner_id, purchase_date, warranty_start, warranty_end to null
      if (!req.body.owner_id) {
        params[16] = null; // owner_id
        params[17] = null; // purchase_date
        params[18] = null; // warranty_start
        params[19] = null; // warranty_end
      }
      // SQL insert
      const query = `INSERT INTO products (
          serial_number, name, type, category, image_url, body_weight, operating_weight, overall_length, overall_width, overall_height, required_oil_flow, operating_pressure, impact_rate, impact_rate_soft_rock, hose_diameter, rod_diameter, applicable_carrier, owner_id, purchase_date, warranty_start, warranty_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await db.query(query, params);
      res.status(201).json({ id: result.insertId, image_url: imageUrl });
    } catch (err) {
      next(err);
    }
  },
];

module.exports = { getAllProducts, getFilteredProducts, createProduct };
