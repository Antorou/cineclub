import React, { useContext } from 'react';
import { Film, User, LogOut } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { activeUser, logout } = useContext(UserContext);

  // If no user is logged in, don't show the navbar above the login screen!
  if (!activeUser) return null;

  return (
    <header className="navbar glass-panel">
      <Link to="/" className="brand">
        <Film className="brand-icon" size={28} />
        <h1 className="brand-name text-gradient">Le Cinéclub</h1>
      </Link>
      
      <div className="user-section">
        <div className="current-user">
          <User size={18} className="user-icon" />
          <span>Logged in as <strong>{activeUser}</strong></span>
        </div>
        <button className="btn-switch" onClick={logout} title="Secure Logout" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <LogOut size={16} color="#fca5a5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
