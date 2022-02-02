const express = require('express');
const router = express.Router();
const userRoute = require('./users');
const socialMediaRoute = require('./socialmedia');
const photoRoute = require('./poto');
const commentRoute = require('./comment')
const verifyToken = require('../middleware/verifyToken');

router.use('/users', userRoute);
router.use('/socialmedias', verifyToken, socialMediaRoute);
router.use('/photos', verifyToken,photoRoute);
router.use('/comments', verifyToken,commentRoute);

module.exports = router;
