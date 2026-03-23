const Note = require('../models/Note');
const Session = require('../models/Session');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.getNotes = async (req, res) => {
  try {
    const { subject_code, unit_number } = req.query;
    if (!subject_code) return res.status(400).json({ message: 'subject_code is required' });

    const filter = {
      subject_code,
      regulation: req.user.regulation || 'R23'
    };

    if (unit_number !== undefined && unit_number !== 'null') {
      filter.unit_number = Number(unit_number);
    }

    const notes = await Note.find(filter).sort({ is_important: -1, created_at: -1 }).populate('uploaded_by', 'display_name avatar_initials');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdminNotes = async (req, res) => {
  try {
    const notes = await Note.find({ uploaded_by: req.user.userId })
                            .sort({ created_at: -1 })
                            .limit(20)
                            .populate('uploaded_by', 'display_name avatar_initials');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No PDF file uploaded' });

    const { branch, year, semester, regulation, subject_code, subject_name, subject_type, unit_number, unit_label, title, description, is_important, important_message, tags } = req.body;

    const newNote = await Note.create({
      branch,
      year: Number(year),
      semester: Number(semester),
      regulation: regulation || 'R23',
      subject_code,
      subject_name,
      subject_type,
      unit_number: Number(unit_number),
      unit_label,
      title,
      description,
      cloudinary_url: req.file.path,
      cloudinary_public_id: req.file.filename,
      file_size_mb: Number((req.file.size / (1024 * 1024)).toFixed(2)),
      uploaded_by: req.user.userId,
      is_important: is_important === 'true' || is_important === true,
      important_message,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await cloudinary.uploader.destroy(note.cloudinary_public_id, { resource_type: 'raw' });
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.viewNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { $inc: { view_count: 1 } }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await Session.create({
      user_id: req.user.userId,
      action_type: 'view_note',
      subject_code: note.subject_code,
      subject_name: note.subject_name
    });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.proxyPdf = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Direct stream now that PDF delivery is enabled in Cloudinary
    const cloudinaryResponse = await axios.get(note.cloudinary_url, {
      responseType: 'stream'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${note.title}.pdf"`);
    
    cloudinaryResponse.data.pipe(res);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ message: 'Failed to proxy PDF', error: error.message });
  }
};
