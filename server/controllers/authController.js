const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.is_active) return res.status(403).json({ message: 'Account is deactivated' });

    const payload = {
      userId: user._id,
      role: user.role,
      branch: user.branch,
      year: user.year,
      semester: user.semester,
      regulation: user.regulation,
      display_name: user.display_name,
      roll_number: user.roll_number
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await Session.create({
      user_id: user._id,
      action_type: 'login'
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        display_name: user.display_name,
        avatar_initials: user.avatar_initials,
        role: user.role,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        regulation: user.regulation,
        roll_number: user.roll_number
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { display_name, email, password, roll_number, branch, year, semester } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if roll number already exists
    const existingRoll = await User.findOne({ roll_number: roll_number.toUpperCase() });
    if (existingRoll) {
      return res.status(400).json({ message: 'Roll number already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      display_name,
      email,
      password: hashedPassword,
      roll_number: roll_number.toUpperCase(),
      branch,
      year: parseInt(year),
      semester: parseInt(semester),
      role: 'student',
      regulation: 'R23'
    });

    // Generate tokens (Same as login)
    const payload = {
      userId: newUser._id,
      role: newUser.role,
      branch: newUser.branch,
      year: newUser.year,
      semester: newUser.semester,
      regulation: newUser.regulation,
      display_name: newUser.display_name,
      roll_number: newUser.roll_number
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { 
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' 
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { 
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await Session.create({
      user_id: newUser._id,
      action_type: 'login' // Registration counts as first login
    });

    res.status(201).json({
      accessToken,
      user: {
        id: newUser._id,
        display_name: newUser.display_name,
        avatar_initials: newUser.avatar_initials,
        role: newUser.role,
        branch: newUser.branch,
        year: newUser.year,
        semester: newUser.semester,
        regulation: newUser.regulation,
        roll_number: newUser.roll_number
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

exports.updateSemester = async (req, res) => {
  try {
    const { year, semester } = req.body;

    if (!year || !semester) {
      return res.status(400).json({ message: 'Year and semester are required' });
    }

    const parsedYear = parseInt(year);
    const parsedSemester = parseInt(semester);

    if (![1, 2, 3, 4].includes(parsedYear)) {
      return res.status(400).json({ message: 'Year must be between 1 and 4' });
    }
    if (![1, 2].includes(parsedSemester)) {
      return res.status(400).json({ message: 'Semester must be 1 or 2' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { year: parsedYear, semester: parsedSemester },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Issue a fresh access token with updated year/semester
    const payload = {
      userId: user._id,
      role: user.role,
      branch: user.branch,
      year: user.year,
      semester: user.semester,
      regulation: user.regulation,
      display_name: user.display_name,
      roll_number: user.roll_number
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    });

    // Also issue a fresh refresh token so the cookie stays in sync
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        display_name: user.display_name,
        avatar_initials: user.avatar_initials,
        role: user.role,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        regulation: user.regulation,
        roll_number: user.roll_number
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const payload = {
      userId: decoded.userId,
      role: decoded.role,
      branch: decoded.branch,
      year: decoded.year,
      semester: decoded.semester,
      regulation: decoded.regulation,
      display_name: decoded.display_name,
      roll_number: decoded.roll_number
    };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
    res.json({ accessToken });
  });
};
