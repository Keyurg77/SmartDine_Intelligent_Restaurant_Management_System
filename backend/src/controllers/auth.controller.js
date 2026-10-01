const bcrypt = require('bcrypt');
const pool = require('../config/database');
const asyncHandler = require('../utils/async-handler');
const { isEmail, isNonEmpty } = require('../utils/validators');
const { logActivity } = require('../services/activity.service');

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!isNonEmpty(fullName) || !isEmail(email) || !isNonEmpty(password) || password.length < 8) {
    return res.status(400).json({
      message: 'Full name, valid email, and password of at least 8 characters are required.',
    });
  }

  const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email.trim()]);
  if (existingUsers.length > 0) {
    return res.status(409).json({ message: 'An account already exists for this email.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES (?, ?, ?, 'customer')`,
    [fullName.trim(), email.trim().toLowerCase(), passwordHash]
  );

  await logActivity({
    userId: result.insertId,
    action: 'REGISTER',
    entityType: 'user',
    entityId: result.insertId,
    details: 'Customer account created.',
  });

  return res.status(201).json({
    message: 'Registration successful.',
    user: {
      id: result.insertId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer',
      status: 'active',
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email) || !isNonEmpty(password)) {
    return res.status(400).json({ message: 'Valid email and password are required.' });
  }

  const [users] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [
    email.trim().toLowerCase(),
  ]);

  const user = users[0];
  if (!user || user.status !== 'active') {
    return res.status(401).json({ message: 'Invalid login details.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid login details.' });
  }

  req.session.user = publicUser(user);

  await logActivity({
    userId: user.id,
    action: 'LOGIN',
    entityType: 'user',
    entityId: user.id,
    details: 'User logged in.',
  });

  return res.json({
    message: 'Login successful.',
    user: req.session.user,
  });
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.currentUser ? req.currentUser.id : null;

  req.session.destroy(async () => {
    if (userId) {
      await logActivity({
        userId,
        action: 'LOGOUT',
        entityType: 'user',
        entityId: userId,
        details: 'User logged out.',
      });
    }

    res.clearCookie('smartdine.sid');
    return res.json({ message: 'Logout successful.' });
  });
});

function me(req, res) {
  return res.json({ user: req.currentUser });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
