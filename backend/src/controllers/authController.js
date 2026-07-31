const jwt = require('jsonwebtoken');

// Teacher note: Instead of validating against a hardcoded string in the code, 
// a securely developed app validates against secret environment variables, keeping them hidden!
const loginUser = (req, res) => {
  const { username, password } = req.body;

  let isValid = false;
  // We check against the powerful .env file. (If you forget to set it, we fallback to our string).
  const antoinePass = process.env.ANTOINE_PASSWORD || 'antoine2026';
  const leaPass = process.env.LEA_PASSWORD || 'lea2026';

  if (username === 'Antoine' && password === antoinePass) isValid = true;
  if (username === 'Léa' && password === leaPass) isValid = true;

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a JSON Web Token (JWT)! 
  // It's basically a cryptographic VIP wristband that validates the user for 7 days.
  const token = jwt.sign(
    { username: username }, 
    process.env.JWT_SECRET || 'cineclub_advanced_super_secret_key_123', 
    { expiresIn: '7d' } 
  );

  res.json({ token, username });
};

module.exports = { loginUser };
