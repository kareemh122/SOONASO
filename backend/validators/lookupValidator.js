const { query, validationResult } = require('express-validator');

const lookupValidator = [
  query('serial')
    .trim()
    .isLength({ min: 1, max: 100 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ error: 'Invalid serial number' });
    next();
  }
];

module.exports = lookupValidator;
