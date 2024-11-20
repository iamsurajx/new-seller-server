// Importing modules
import jwt from 'jsonwebtoken';

// Middleware function to ensure authentication
export const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) {
      return res.status(403).json({ message: "Unauthorized, JWT token is required" });
  }
  try {
      const decoded = jwt.verify(auth, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (err) { // Using underscore to indicate unused variable
      return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
  }
}

