const Subject = require('../models/Subject');
const Note = require('../models/Note');

exports.getSubjects = async (req, res) => {
  try {
    const { branch, year, semester, regulation } = req.user;
    
    // Admins can query specific subjects by passing query params. 
    // Defaults to the logged-in student's details.
    const filter = {
      branch: req.query.branch || branch,
      year: req.query.year || year,
      semester: req.query.semester || semester,
      regulation: req.query.regulation || regulation
    };

    const subjects = await Subject.find(filter).sort({ order: 1 });

    const grouped = {
      regular: subjects.filter(s => s.type === 'regular'),
      nptel: subjects.filter(s => s.type === 'nptel'),
      lab: subjects.filter(s => s.type === 'lab'),
      elective: subjects.filter(s => s.type === 'elective'),
    };

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const { branch, year, semester } = req.query;
    const filter = {};
    if (branch && branch !== 'All') filter.branch = branch;
    if (year && year !== 'All') filter.year = Number(year);
    if (semester && semester !== 'All') filter.semester = Number(semester);

    const subjects = await Subject.find(filter).sort({ year: 1, semester: 1, order: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Browse subjects — any logged-in student, any branch/year/semester (no JWT filter)
exports.browseSubjects = async (req, res) => {
  try {
    const { branch, year, semester } = req.query;

    if (!branch || !year || !semester) {
      return res.status(400).json({ message: 'branch, year, and semester are required' });
    }

    const subjects = await Subject.find({
      branch,
      year: Number(year),
      semester: Number(semester)
    }).sort({ order: 1 });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.createSubject = async (req, res) => {
  try {
    const {
      subject_code, subject_name, branch, year, semester,
      regulation, type, credits, is_theory,
      nptel_course_url, nptel_weeks_total, order
    } = req.body;

    if (!subject_code || !subject_name || !branch || !year || !semester || !type || credits === undefined || order === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const upperCode = subject_code.toUpperCase();
    const existing = await Subject.findOne({ subject_code: upperCode });
    if (existing) {
      return res.status(400).json({ message: 'This subject code already exists. Use a different code.' });
    }

    const subject = new Subject({
      subject_code: upperCode,
      subject_name,
      branch,
      year,
      semester,
      regulation: regulation || 'R23',
      type,
      credits,
      is_theory: is_theory !== undefined ? is_theory : true,
      nptel_course_url,
      nptel_weeks_total: nptel_weeks_total || 12,
      order
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.subject_code) {
      updateData.subject_code = updateData.subject_code.toUpperCase();
      const existing = await Subject.findOne({ 
        subject_code: updateData.subject_code, 
        _id: { $ne: id } 
      });
      if (existing) {
        return res.status(400).json({ message: 'This subject code already exists. Use a different code.' });
      }
    }

    const subject = await Subject.findByIdAndUpdate(id, updateData, { new: true });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const notesCount = await Note.countDocuments({ subject_code: subject.subject_code });
    if (notesCount > 0) {
      return res.status(400).json({ message: 'Cannot delete — notes exist for this subject. Delete the notes first.' });
    }

    await Subject.findByIdAndDelete(id);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
