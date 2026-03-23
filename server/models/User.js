const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'student'], required: true },
  display_name: { type: String, required: true },
  avatar_initials: { type: String, required: true },
  branch: { type: String, enum: ['CSE', 'CAI', 'ECE', 'EEE', 'CIVIL', 'MECH'] },
  year: { type: Number, min: 1, max: 4 },
  semester: { type: Number, min: 1, max: 2 },
  regulation: { type: String, default: 'R23' },
  roll_number: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Pre-validate hook to generate avatar initials
userSchema.pre('validate', function(next) {
  if (this.display_name && !this.avatar_initials) {
    const parts = this.display_name.trim().split(' ');
    if (parts.length >= 2) {
      this.avatar_initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
      this.avatar_initials = parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
      this.avatar_initials = parts[0].toUpperCase() + parts[0].toUpperCase();
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
