const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const rateLimit = require('express-rate-limit');

// Limiter for brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);

router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.patch('/update-semester', authenticate, authController.updateSemester);

module.exports = router;
