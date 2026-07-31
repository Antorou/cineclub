import React, { useContext } from 'react';
import { Film, User, SwitchRight } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // We elegantly tap into our Context to get the current user and the toggle function
  const { activeUser, toggleUser } = useContext(UserContext);

  return (
    <header className="navbar glass-panel">
      <Link to="/" className="brand">
        <Film className="brand-icon" size={28} />
        <h1 className="brand-name text-gradient">Le Cinéclub</h1>
      </Link>
      
      <div className="user-section">
        <div className="current-user">
          <User size={18} className="user-icon" />
          <span>Viewing as: <strong>{activeUser}</strong></span>
        </div>
        <button className="btn-switch" onClick={toggleUser} title="Switch User">
          <SwitchRight size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
