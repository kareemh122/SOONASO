const xss = require("xss");

// Fields that are expected to be numbers
const numericFields = new Set([
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
  "owner_id",
]);

const sanitizeFields = (body, fields) => {
  return fields.map((field) => {
    let value = body[field];

    if (value === undefined || value === null || value === "") return null;

    // Respect validator's parsed numeric input
    if (numericFields.has(field)) {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }

    // For everything else, sanitize string inputs
    if (typeof value === "string") {
      value = value.trim();
      return xss(value);
    }

    return value;
  });
};

const sanitizeImagePath = (filePath) => {
  return filePath ? xss(filePath.slice(0, 512)) : null;
};

module.exports = { sanitizeFields, sanitizeImagePath };
