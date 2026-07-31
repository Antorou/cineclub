require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize the Express application
const app = express();
const port = process.env.PORT || 5000;

// 2. Set up Middleware (the tools our server uses on every request)
app.use(cors());         // Allows our future React frontend to securely talk to this API
app.use(express.json()); // Allows our server to seamlessly read JSON data wrapped in incoming requests

// 3. Initialize Supabase Client (bypassing limits with our service key)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 4. Create our very first Test Endpoint!
app.get('/api/health', (req, res) => {
  res.json({ message: 'api is running' });
});

// 5. Tell the server to start listening for requests
app.listen(port, () => {
  console.log(`api running on http://localhost:${port}`);
});
