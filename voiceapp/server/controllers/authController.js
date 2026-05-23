const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(admin._id);
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const admin = await Admin.create({ name, email, password, role });
    const token = signToken(admin._id);
    res.status(201).json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  res.json(req.admin);
};
