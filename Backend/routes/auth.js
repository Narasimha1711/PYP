const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const AuthController = require('../controller/authController.js');
const errorHandler = require('../middleware/errorMiddleware.js');
// Signup Route
router.post('/signup', errorHandler, AuthController.signup);

router.post('/signin', errorHandler, AuthController.signin);

router.post('/logout', errorHandler, AuthController.logout);

router.get('/google', errorHandler, AuthController.googleAuth);

router.get('/google/callback', errorHandler, AuthController.googleAuthCallback);

router.post('/complete-google-signup', AuthController.completeGoogleSignup);


module.exports = router;
