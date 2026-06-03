const express = require('express');
const router = express.Router();
const meeraController = require('../controllers/meeraController');
const authenticate = require('../middleware/authenticate');
const rateLimit = require('express-rate-limit');

// Global Limiter - 20 req / min across all users to protect Groq quota
const meeraGlobalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, 
  message: { message: "Too many requests to Meera globally. Please wait 60 seconds." },
  keyGenerator: () => 'global_meera' // All share the same bucket
});

// Per-User Limiter - 5 req / min per user
const meeraPerUserLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: "Too many requests. Please wait 60 seconds before asking Meera again." },
  keyGenerator: (req) => req.user?.userId || 'anonymous'
});

router.post('/chat', authenticate, meeraPerUserLimiter, meeraGlobalLimiter, meeraController.chatStream);


module.exports = router;
