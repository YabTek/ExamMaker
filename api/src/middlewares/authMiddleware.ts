import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const SECRET_KEY = process.env.SECRET_KEY; 
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  };
  