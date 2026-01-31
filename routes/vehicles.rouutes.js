const express = require('express');
const router = express.Router();
const {addVehicle, assignDriver, getVehicle} = require('../controllers/vehicle.controller');
const rateLimiter = require('../middleware/rate.limiter.middleware');

router.post('/add', rateLimiter, addVehicle);
router.patch('/assign-driver/:vehicleId', assignDriver);
router.get('/:vehicleId', getVehicle);

module.exports = router;