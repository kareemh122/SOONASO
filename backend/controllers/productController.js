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
    if (!rows.length) {
      return res.status(200).json({
        data: [],
        message: "No products found",
      });
    }

    res.status(200).json({
      data: rows,
      message: "Products retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: "Invalid product ID" });

    const [rows] = await db.query(
      `SELECT p.*, o.full_name, o.company FROM products p LEFT JOIN owners o ON p.owner_id = o.id WHERE p.id = ?`,
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json({
      data: rows[0],
      message: "Product retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

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
                return "p.operating_weight <= 500";
              case "500-1400kg":
                return "p.operating_weight > 500 AND p.operating_weight <= 1400";
              case "1400-2000kg":
                return "p.operating_weight > 1400 AND p.operating_weight <= 2000";
              case "2000-3000kg":
                return "p.operating_weight > 2000 AND p.operating_weight <= 3000";
              case "3000-5000kg":
                return "p.operating_weight > 3000 AND p.operating_weight <= 5000";
              case "5000kg+":
                return "p.operating_weight > 5000";
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
                return "p.required_oil_flow <= 35";
              case "35-55l/min":
                return "p.required_oil_flow > 35 AND p.required_oil_flow <= 55";
              case "55-70l/min":
                return "p.required_oil_flow > 55 AND p.required_oil_flow <= 70";
              case "70-95/min":
                return "p.required_oil_flow > 70 AND p.required_oil_flow <= 95";
              case "95-165l/min":
                return "p.required_oil_flow > 95 AND p.required_oil_flow <= 165";
              case "165/min+":
                return "p.required_oil_flow > 165";
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
                return "p.applicable_carrier REGEXP '(^|[^0-9])([0-5])([^0-9]|$)'";
              case "5-14ton":
                return "p.applicable_carrier REGEXP '([5-9]|1[0-4])ton'";
              case "14-20ton":
                return "p.applicable_carrier REGEXP '(1[4-9]|20)ton'";
              case "20-30ton":
                return "p.applicable_carrier REGEXP '(2[0-9]|30)ton'";
              case "30-50ton":
                return "p.applicable_carrier REGEXP '(3[0-9]|4[0-9]|50)ton'";
              case "50+ton":
                return "p.applicable_carrier REGEXP '(5[0-9]|[6-9][0-9]|[1-9][0-9]{2,})ton'";
              default:
                return "1=0";
            }
          })
          .join(" OR ") +
        ")";
    }
    query += " ORDER BY p.id DESC";
    const [rows] = await db.query(query, params);
    if (!rows.length) {
      return res.status(200).json({
        data: [],
        message: "No products found matching your filter criteria",
      });
    }

    res.status(200).json({
      data: rows,
      message: "Filtered products retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    // DB field order (excluding image_url for now)
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

    // Insert Cloudinary image URL at correct index (after category = index 3)
    const imageUrl = sanitizeImagePath(req.file?.path);
    params.splice(4, 0, imageUrl); // Now image_url is inserted at index 4

    // If no owner, set owner-related fields to null
    const ownerIndex = fields.indexOf("owner_id") + 1; // +1 because of image_url inserted
    if (!req.body.owner_id) {
      params[ownerIndex] = null;     // owner_id
      params[ownerIndex + 1] = null; // purchase_date
      params[ownerIndex + 2] = null; // warranty_start
      params[ownerIndex + 3] = null; // warranty_end
    }

    const query = `INSERT INTO products (
      serial_number, name, type, category, image_url,
      body_weight, operating_weight, overall_length, overall_width, overall_height,
      required_oil_flow, operating_pressure, impact_rate, impact_rate_soft_rock,
      hose_diameter, rod_diameter, applicable_carrier,
      owner_id, purchase_date, warranty_start, warranty_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, params);
    res.status(201).json({
      id: result.insertId,
      image_url: imageUrl,
      message: "Product created successfully",
    });
  } catch (err) {
    next(err);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: "Invalid product ID" });

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
    // Handle image update if provided
    let imageUrl = null;
    if (req.file && req.file.path) imageUrl = sanitizeImagePath(req.file.path);

    // If no owner, set owner_id, purchase_date, warranty_start, warranty_end to null
    const ownerIndex = fields.indexOf("owner_id");
    if (!req.body.owner_id) {
      params[ownerIndex] = null;
      params[ownerIndex + 1] = null;
      params[ownerIndex + 2] = null;
      params[ownerIndex + 3] = null;
    }
    // Build SET clause
    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    let query = `UPDATE products SET ${setClause}`;
    if (imageUrl) {
      query += ", image_url = ?";
      params.push(imageUrl);
    }
    query += " WHERE id = ?";
    params.push(id);
    const [result] = await db.query(query, params);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      image_url: imageUrl,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0)
      return res.status(400).json({ error: "Invalid product ID" });

    // Optionally: fetch and delete image from Cloudinary here if needed
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getFilteredProducts,
  createProduct,
  getProductById,
  editProduct,
  deleteProduct,
};
