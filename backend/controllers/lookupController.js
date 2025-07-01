const db = require('../config/db');

const lookupBySerial = async (req, res, next) => {
  const serial = req.query.serial;
  try {
    const [rows] = await db.query(
      `SELECT p.product_name, p.product_model, p.image_url, o.full_name, p.warranty_start, p.warranty_end 
       FROM products p 
       LEFT JOIN owners o ON p.owner_id = o.id 
       WHERE p.serial_number = ?`,
      [serial]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { lookupBySerial };
