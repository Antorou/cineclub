import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    // The UserProvider wraps the whole app, giving everything access to the UserContext!
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* We will add /upload and /movie/:id routes here very soon! */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
