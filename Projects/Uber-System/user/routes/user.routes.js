const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const authMiddlware = require('../middleware/authMiddleware')

router.get('/', (req, res) => {
    res.send('This is User Route.')
})

router.post('/register',userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout)
router.get('/profile', authMiddlware.userAuth, userController.profile);

module.exports = router;
