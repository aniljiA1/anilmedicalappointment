const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret_key');
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
