const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const socialMediaRoute = require('./socialmedia');
const verifyToken = require('../middleware/verifyToken');

router.use('/users', userRoute);
router.use('/socialmedias', verifyToken, socialMediaRoute);

module.exports = router;
