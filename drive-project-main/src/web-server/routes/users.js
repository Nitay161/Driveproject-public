const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// User Registration
router.post('/users', usersController.register);

// User Login (Create Token)
router.post('/tokens', usersController.login);

// Get User Details
router.get('/users/:id', usersController.getUser);

module.exports = router;