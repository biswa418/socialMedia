const express = require('express');
const router = express.Router();

const resetPasswordController = require('../controllers/resetPasswordController');

router.get('/init', resetPasswordController.createSession);
router.get('/confirm/:accessToken', resetPasswordController.confirmPass);
router.post('/', resetPasswordController.createToken);
router.post('/init/:accessToken', resetPasswordController.resetPass);

module.exports = router;


