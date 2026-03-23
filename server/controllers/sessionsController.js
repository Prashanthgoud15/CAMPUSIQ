const Session = require('../models/Session');

exports.logSession = async (req, res) => {
  try {
    const { action_type, subject_code, subject_name } = req.body;
    await Session.create({
      user_id: req.user.userId,
      action_type,
      subject_code,
      subject_name
    });
    res.status(201).json({ message: 'Session logged' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
