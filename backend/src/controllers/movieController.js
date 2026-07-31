const supabase = require('../config/supabase');

// --- Helper Functions ---
// We can consider this our 'Service' layer. It handles external API interactions.
const uploadPdfToStorage = async (file) => {
  if (!file) return null;

  // Create a fairly unique file name, stripping out weird characters
  const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
  
  // Upload to Supabase Storage Bucket ('diaporamas')
  const { data, error } = await supabase
    .storage
    .from('diaporamas')
    .upload(fileName, file.buffer, {
      contentType: 'application/pdf',
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
    const { title, genre, duration_minutes, presenter } = req.body;
    const file = req.file; // This is extracted automatically by our 'multer' middleware

    if (!title || !presenter) {
      return res.status(400).json({ error: 'Title and Presenter are absolutely required.' });
    }

    // Step 1: Upload the file if one was provided in the request
    let diaporamaUrl = null;
    if (file) {
      diaporamaUrl = await uploadPdfToStorage(file);
    }

    // Step 2: Insert the movie record into the database, including the string URL to the file
    const { data, error } = await supabase
      .from('movies')
      .insert([{
        title,
        genre,
        duration_minutes: duration_minutes ? parseInt(duration_minutes) : null,
        presenter,
        diaporama_url: diaporamaUrl
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

module.exports = {
  getAllMovies,
  createMovie
};
