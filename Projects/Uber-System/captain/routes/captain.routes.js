const express = require('express');
const router = express.Router();
const captainController = require('../controllers/captain.controller')
const authMiddlware = require('../middleware/authMiddleware')

router.get('/', (req, res) => {
    res.send('This is Captain Route.')
})

router.post('/register',captainController.register);
router.post('/login', captainController.login);
router.get('/logout', captainController.logout)
router.get('/profile', authMiddlware.captainAuth, captainController.profile);

module.exports = router;
