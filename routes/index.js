const express = require('express');

const router = express.Router();
const homeController = require('../controllers/homeController');

console.log('started routing');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./post'));
router.use('/comments', require('./comments'));

router.use('/api', require('./api'));

module.exports = router;