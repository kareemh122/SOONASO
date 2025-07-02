const db = require("../config/db");
const { sanitizeFields, sanitizeImagePath } = require("../utils/sanitizeInput");

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

// --- Controller to handle product creation with image upload and secure input validation ---
const createProduct = async (req, res, next) => {
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

    let params = sanitizeFields(req.body, fields);
    // Insert Cloudinary image URL at correct position (after category)
    let imageUrl = sanitizeImagePath(req.file?.path);

    // If no owner, set owner_id, purchase_date, warranty_start, warranty_end to null
    const ownerIndex = fields.indexOf("owner_id");
    if (!req.body.owner_id) {
      params[ownerIndex] = null;      // owner_id
      params[ownerIndex + 1] = null; // purchase_date
      params[ownerIndex + 2] = null; // warranty_start
      params[ownerIndex + 3] = null; // warranty_end
    }
    // SQL insert
    const query = `INSERT INTO products (
          serial_number, name, type, category, image_url, body_weight, operating_weight, overall_length, overall_width, overall_height, required_oil_flow, operating_pressure, impact_rate, impact_rate_soft_rock, hose_diameter, rod_diameter, applicable_carrier, owner_id, purchase_date, warranty_start, warranty_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, params); 
    res.status(201).json({ id: result.insertId, image_url: imageUrl });
  } 
  catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getFilteredProducts, createProduct };
