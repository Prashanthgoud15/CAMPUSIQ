const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const authenticate = require('../middleware/authenticate');

router.post('/log', authenticate, sessionsController.logSession);

module.exports = router;
