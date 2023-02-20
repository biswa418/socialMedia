const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');


router.get('/profile', userController.profile);
router.get('/sign-up', userController.signup);
router.get('/sign-in', userController.signin);

router.post('/create', userController.create);
router.post('/create-session', userController.createSession);
router.post('/reset-session', userController.resetSession);

module.exports = router;