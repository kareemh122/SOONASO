const express = require('express');
const { lookupBySerial } = require('../controllers/lookupController');
const lookupValidator = require('../validators/lookupValidator');
const lookupLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

router.get('/', lookupLimiter, lookupValidator, lookupBySerial);

module.exports = router;
