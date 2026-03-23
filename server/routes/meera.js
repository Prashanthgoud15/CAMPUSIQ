const express = require('express');
const router = express.Router();
const meeraController = require('../controllers/meeraController');
const authenticate = require('../middleware/authenticate');

router.post('/chat', authenticate, meeraController.chatStream);

module.exports = router;
