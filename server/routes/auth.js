const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

// Demo users — replace with a real DB later if needed
const USERS = [
  { id: 1, username: 'student', password: 'epita2025', role: 'student' },
  { id: 2, username: 'admin',   password: 'admin2025', role: 'admin'   },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, username: user.username, role: user.role });
});

// POST /api/auth/verify — frontend calls this on page load to check if token is still valid
router.post('/verify', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;
