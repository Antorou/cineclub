const multer = require('multer');

// We use memory storage to keep the PDF file in RAM temporarily.
// This allows us to pipe it directly to Supabase storage without saving it to disk first.
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
