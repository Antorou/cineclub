const jwt = require('jsonwebtoken');

// Teacher's Note: This is an Express "Middleware". It explicitly intercepts incoming requests,
// checks their VIP wristband (JWT token), and either heavily rejects them or lets them pass into the controller!
const protect = (req, res, next) => {
  let token;
  
  // Look for the "Authorization: Bearer <token>" header sent securely from React
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract just the cryptographic token part
      
      // Verify the token mathematically using our secret key!
      // If a hacker faked the token, this will instantly crash and trigger the `catch` block below.
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cineclub_advanced_super_secret_key_123');
      
      // Attach the successfully decoded username securely to the request for our controllers to use
      req.user = decoded;
      
      return next(); // You are approved! Pass exactly to the controller!
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token cryptographic signature failed!' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, completely missing token.' });
  }
};

module.exports = { protect };
