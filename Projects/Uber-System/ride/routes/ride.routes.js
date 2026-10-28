const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const rideController = require('../controller/ride.controller');

router.get('/', (req, res) => {
  res.send('Ride API is working');
}
)

router.post('/create-ride',authMiddleware.userAuth, rideController.createRide);

module.exports = router;