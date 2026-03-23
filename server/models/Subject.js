const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  branch: { type: String, required: true, enum: ['CSE', 'CAI', 'ECE', 'EEE', 'CIVIL', 'MECH'] },
  year: { type: Number, required: true, min: 1, max: 4 },
  semester: { type: Number, required: true, min: 1, max: 2 },
  regulation: { type: String, default: 'R23' },
  subject_code: { type: String, required: true },
  subject_name: { type: String, required: true },
  type: { type: String, enum: ['regular', 'nptel', 'lab', 'elective'], default: 'regular' },
  credits: { type: Number, required: true },
  is_theory: { type: Boolean, default: true },
  nptel_course_url: { type: String },
  nptel_weeks_total: { type: Number, default: 12 },
  nptel_deadline: { type: Date },
  order: { type: Number, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('Subject', subjectSchema);
