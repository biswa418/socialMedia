const express = require('express');
const router = express.Router();

const passport = require('passport');
const userController = require('../controllers/userController');

//if only authenticated then send to profile page so middleware checkAuthentication helps
router.get('/profile/:id', passport.checkAuthentication, userController.profile);

router.get('/sign-up', userController.signup);
router.get('/sign-in', userController.signin);

router.get('/sign-out', userController.destroySession);

router.post('/create', userController.create);

router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), userController.createSession);

module.exports = router;