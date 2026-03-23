const express = require('express');
const router = express.Router();
const subjectsController = require('../controllers/subjectsController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, subjectsController.getSubjects);
router.get('/all', authenticate, authorize('admin'), subjectsController.getAllSubjects);

module.exports = router;
