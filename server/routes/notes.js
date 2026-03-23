const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/uploadMiddleware');

router.get('/', authenticate, notesController.getNotes);
router.get('/:id/proxy', authenticate, notesController.proxyPdf);
router.post('/:id/view', authenticate, notesController.viewNote);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), notesController.getAdminNotes);
router.post('/', authenticate, authorize('admin'), upload.single('pdf'), notesController.createNote);
router.delete('/:id', authenticate, authorize('admin'), notesController.deleteNote);

module.exports = router;
