const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action_type: { type: String, enum: ['view_note', 'meera_chat', 'login'], required: true },
  subject_code: { type: String },
  subject_name: { type: String },
  timestamp: { type: Date, default: Date.now }
});

sessionSchema.index({ user_id: 1, timestamp: -1 });

module.exports = mongoose.model('Session', sessionSchema);
