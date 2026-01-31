const express = require('express');
const router = express.Router();
const {getAnalytics} = require('../controllers/analyt.controller');

router.get('/', getAnalytics);

module.exports = router;