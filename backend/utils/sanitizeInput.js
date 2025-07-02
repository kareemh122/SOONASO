const xss = require("xss");

// Utility function to sanitize input fields to prevent XSS 
const sanitizeFields = (body, fields) => {
  return fields.map((field) => {
    let value = body[field] !== undefined ? body[field] : null;
    if (typeof value === "string") value = xss(value);
    return value;
  });
};

const sanitizeImagePath = (filePath) => {
  return filePath ? xss(filePath.slice(0, 512)) : null;
};

module.exports = { sanitizeFields, sanitizeImagePath };
