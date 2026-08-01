import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import EditMovie from './pages/EditMovie';
import Login from './pages/Login';

// ✨ TEACHER CONCEPT: The "Protected Route" component. 
// It wraps around pages. If you aren't logged in, it acts like a bouncer and kicks you securely back to /login!
const ProtectedRoute = ({ children }) => {
  const { activeUser } = useContext(UserContext);
  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// We create an AppRoutes component inside so we can access UserContext (which must be inside UserProvider)
const AppRoutes = () => {
  const { activeUser } = useContext(UserContext);
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={activeUser ? <Navigate to="/" /> : <Login />} />
          
          {/* Protected Routes (You can only see these if ProtectedRoute approves!) */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditMovie /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
