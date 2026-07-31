import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            {/* We will add /movie/:id route here later for the PDF viewer! */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
