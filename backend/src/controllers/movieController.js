const supabase = require('../config/supabase');

// --- Helper Functions ---
// We can consider this our 'Service' layer. It handles external API interactions.
const uploadFileToStorage = async (file) => {
  if (!file) return null;

  // Create a fairly unique file name, stripping out weird characters
  const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  
  // Upload to Supabase Storage Bucket ('diaporamas')
  const { data, error } = await supabase
    .storage
    .from('diaporamas')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      upsert: false
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get the public URL for the newly uploaded PDF
  const { data: publicUrlData } = supabase
    .storage
    .from('diaporamas')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

// --- Controllers ---

const getAllMovies = async (req, res) => {
  try {
    const { data: movies, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(movies);
  } catch (error) {
    console.error('Error in getAllMovies:', error);
    res.status(500).json({ error: 'Failed to fetch movies from the database.' });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, genre, date, presenter } = req.body;
    
    // Check if files array is present (now an object mapping due to upload.fields)
    const pdfFile = req.files?.pdf ? req.files.pdf[0] : null;
    const posterFile = req.files?.poster ? req.files.poster[0] : null;

    if (!title || !presenter) {
      return res.status(400).json({ error: 'Title and Presenter are absolutely required.' });
    }

    // Step 1: Upload the file if one was provided in the request
    let diaporamaUrl = null;
    if (pdfFile) {
      diaporamaUrl = await uploadFileToStorage(pdfFile);
    }
    let poster_url = null;
    if (posterFile) {
      poster_url = await uploadFileToStorage(posterFile);
    }

    // Step 2: Insert the movie record into the database, including the string URL to the file
    const { data, error } = await supabase
      .from('movies')
      .insert([{
        title,
        genre,
        date: date || null,
        presenter,
        diaporama_url: diaporamaUrl,
        poster_url
      }])
      .select();

    if (error) throw error;
    
    // Respond with successful insertion code (201) and the data itself
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error in createMovie:', error);
    res.status(500).json({ error: 'Failed to insert the movie into the system.' });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, review } = req.body;
    const username = req.user.username; // extracted entirely from the secure JWT!

    if (!id || score === undefined) {
      return res.status(400).json({ error: 'Movie ID and Score are required.' });
    }

    // Determine which columns to explicitly modify based purely on secure cryptography!
    const updatePayload = {};
    if (username === 'Antoine') {
      updatePayload.antoine_score = parseInt(score);
      updatePayload.antoine_review = review || '';
    } else if (username === 'Léa') {
      updatePayload.lea_score = parseInt(score);
      updatePayload.lea_review = review || '';
    } else {
      return res.status(403).json({ error: 'Access implicitly denied: Unknown user profile.' });
    }

    // Perform database UPDATE
    const { data, error } = await supabase
      .from('movies')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Movie strictly not found.' });
    
    res.json(data[0]); // Return the freshly updated row!
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(500).json({ error: 'Failed to accurately update database scorecards.' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.user.username; 

    // Find the movie first to check presenter and get diaporama_url
    const { data: movie, error: fetchError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !movie) return res.status(404).json({ error: 'Movie not found' });
    
    // Authorization check
    if (movie.presenter !== username && username !== 'Admin') { 
        return res.status(403).json({ error: 'Unauthorized to delete this movie' });
    }

    // Optionally delete from storage Bucket
    if (movie.diaporama_url) {
      const fileName = movie.diaporama_url.split('/').pop();
      if (fileName) {
         await supabase.storage.from('diaporamas').remove([fileName]);
      }
    }

    const { error: deleteError } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMovie:', error);
    res.status(500).json({ error: 'Failed to delete movie.' });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, date } = req.body;
    const username = req.user.username;
    
    const { data: movie, error: fetchError } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !movie) return res.status(404).json({ error: 'Movie not found' });
    if (movie.presenter !== username && username !== 'Admin') {
        return res.status(403).json({ error: 'Unauthorized to edit this movie' });
    }

    if (!title) {
        return res.status(400).json({ error: 'Title is absolutely required.' });
    }

    const pdfFile = req.files?.pdf ? req.files.pdf[0] : null;
    const posterFile = req.files?.poster ? req.files.poster[0] : null;

    let diaporamaUrl = movie.diaporama_url;
    if (pdfFile) {
      // upload new
      diaporamaUrl = await uploadFileToStorage(pdfFile);
      // optionally delete old file from storage
      if (movie.diaporama_url) {
         const oldFileName = movie.diaporama_url.split('/').pop();
         if (oldFileName) {
            await supabase.storage.from('diaporamas').remove([oldFileName]);
         }
      }
    }
    
    let poster_url = movie.poster_url;
    if (posterFile) {
      poster_url = await uploadFileToStorage(posterFile);
      if (movie.poster_url) {
         const oldPosterName = movie.poster_url.split('/').pop();
         if (oldPosterName) {
            await supabase.storage.from('diaporamas').remove([oldPosterName]);
         }
      }
    }

    const { data, error } = await supabase
       .from('movies')
       .update({
          title,
          genre,
          date: date || null,
          diaporama_url: diaporamaUrl,
          poster_url
       })
       .eq('id', id)
       .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error in updateMovie:', error);
    res.status(500).json({ error: 'Failed to update movie.' });
  }
};

module.exports = {
  getAllMovies,
  createMovie,
  updateReview,
  deleteMovie,
  updateMovie
};
