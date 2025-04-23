// middleware/blogAuthentication.js
const jwt = require('jsonwebtoken');

const blogAuth = (req, res, next) => {
  try {
    // Authentication logic
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = blogAuth;  // Export the function, not an object