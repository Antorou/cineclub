const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const upload = require('../config/upload');

// Fetch all movies (GET /api/movies)
router.get('/', movieController.getAllMovies);

// Create a new movie with a file upload (POST /api/movies)
// The 'upload.single("pdf")' middleware intercepts the request, grabs the file named 'pdf', and puts it in req.file!
router.post('/', upload.single('pdf'), movieController.createMovie);

module.exports = router;
