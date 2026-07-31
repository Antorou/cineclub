require('dotenv').config();
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./src/routes/movieRoutes');

// 1. Initialize the Express application
const app = express();
const port = process.env.PORT || 5000;

// 2. Set up Global Middleware
app.use(cors());         
app.use(express.json());

// 3. Register our application Routes
// Any request starting with /api/movies will be handed off to our movieRoutes file!
app.use('/api/movies', movieRoutes);


// 4. Basic Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'The Cineclub Express API is running elegantly! 🍿' });
});

// 5. Tell the server to start listening for requests
app.listen(port, () => {
  console.log(`🚀 Server is actively listening on http://localhost:${port}`);
});
