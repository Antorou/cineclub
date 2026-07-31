const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../config/upload');
const { protect } = require('../middleware/authMiddleware');

// Fetch all movies (GET /api/movies) -> Now heavily protected!
router.get('/', protect, movieController.getAllMovies);

// Create a new movie with a file upload (POST /api/movies) -> Now heavily protected!
router.post('/', protect, upload.single('pdf'), movieController.createMovie);

module.exports = router;
