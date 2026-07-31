import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { activeUser } = useContext(UserContext);

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section" style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="text-gradient">
          Welcome back, {activeUser}!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          It's movie night. Are you ready to present the next masterpiece, or review the brilliant selection from last week?
        </p>
        
        <Link to="/upload" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} />
          <span>Add New Presentation</span>
        </Link>
      </div>

      <div className="movies-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '2rem', 
        marginTop: '3rem' 
      }}>
        {/* Placeholder until we hook up our Express API! */}
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', opacity: 0.5, gridColumn: '1 / -1' }}>
          <p>The movie gallery will beautifully appear right here very soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
