const express = require('express');
const router = express.Router();
const subjectsController = require('../controllers/subjectsController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, subjectsController.getSubjects);
router.get('/browse', authenticate, subjectsController.browseSubjects);
router.get('/all', authenticate, authorize('admin'), subjectsController.getAllSubjects);
router.post('/', authenticate, authorize('admin'), subjectsController.createSubject);
router.patch('/:id', authenticate, authorize('admin'), subjectsController.updateSubject);
router.delete('/:id', authenticate, authorize('admin'), subjectsController.deleteSubject);

module.exports = router;
