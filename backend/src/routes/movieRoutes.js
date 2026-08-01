const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../config/upload');
const { protect } = require('../middleware/authMiddleware');

// Fetch all movies (GET /api/movies) -> Now heavily protected!
router.get('/', protect, movieController.getAllMovies);

// Create a new movie with a file upload (POST /api/movies) -> Now heavily protected!
router.post('/', protect, upload.single('pdf'), movieController.createMovie);

// Update dual scorecard ratings/reviews securely based on JWT (PUT /api/movies/:id/review)
router.put('/:id/review', protect, movieController.updateReview);

// Delete a movie (DELETE /api/movies/:id)
router.delete('/:id', protect, movieController.deleteMovie);

// Update a movie (PUT /api/movies/:id)
router.put('/:id', protect, upload.single('pdf'), movieController.updateMovie);

module.exports = router;
