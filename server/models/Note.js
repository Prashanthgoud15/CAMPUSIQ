const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  regulation: { type: String, default: 'R23' },
  subject_code: { type: String, required: true },
  subject_name: { type: String, required: true },
  subject_type: { type: String, required: true },
  unit_number: { type: Number, required: true }, // 0 for NPTEL weekly content
  unit_label: { type: String, required: true }, // e.g., "Unit 1", "Week 3", "Assignment"
  title: { type: String, required: true },
  description: { type: String },
  cloudinary_url: { type: String, required: true },
  cloudinary_public_id: { type: String, required: true },
  file_size_mb: { type: Number },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  is_important: { type: Boolean, default: false },
  important_message: { type: String },
  view_count: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Compound index for fast retrieval by semester mapping
noteSchema.index({ branch: 1, year: 1, semester: 1, regulation: 1, subject_code: 1 });

module.exports = mongoose.model('Note', noteSchema);
