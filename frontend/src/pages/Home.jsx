import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { PlusCircle, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { activeUser, token, logout } = useContext(UserContext);
  
  // React State: We hold our movies array locally once loaded from the server
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  // React useEffect: Used for fetching data the instant the component loads onto the screen!
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    fetch(`${API_URL}/api/movies`, {
      headers: {
        'Authorization': `Bearer ${token}` // Flashing our VIP wristband to heavily-secured Express!
      }
    })
      .then(res => {
        if (res.status === 401) {
          logout(); // Automatically trigger completely clean logout if database rejects our token
          throw new Error("Unauthorized - Token Expired");
        }
        return res.json();
      })
      .then(data => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false); // Disable loading spinner instantly once data arrives
      })
      .catch(err => {
        console.error("Error communicating with Express API!", err);
        setMovies([]); // Ensure movies remains an array even on network failure
        setLoading(false);
      });
  }, [token, logout]); // The brackets [] mean "Only run this code ONCE when page loads", but we include dependencies cleanly for linter

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
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem', 
        marginTop: '3rem' 
      }}>
        
        {/* Conditional Rendering logic! */}
        {loading ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>Connecting to secure database...</p>
        ) : movies.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', opacity: 0.5, gridColumn: '1 / -1' }}>
            <p>Your movie gallery is empty. Try adding your first presentation right now!</p>
          </div>
        ) : (
          /* Using the mighty Array.map() function to turn our Data array into beautifully styled HTML elements! */
          movies.map(movie => (
            <div key={movie.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{movie.title}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', borderRadius: '99px' }}>{movie.genre || 'Uncategorized'}</span>
                <span style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px' }}>By {movie.presenter}</span>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                 <span>
                    <strong style={{ color: '#ffb703', marginRight: '6px' }}>★</strong> 
                    {/* Basic Math calculation inline to calculate the average score! */}
                    {(movie.antoine_score || movie.lea_score) 
                       ? (((movie.antoine_score || 0) + (movie.lea_score || 0)) / ((movie.antoine_score ? 1 : 0) + (movie.lea_score ? 1 : 0))).toFixed(1) 
                       : 'No Rating'} 
                 </span>
                 
                 {/* Opens the PDF inside our automated modal viewer! */}
                 {movie.diaporama_url && (
                   <button 
                     onClick={() => setSelectedPdfUrl(movie.diaporama_url)}
                     className="btn-switch" 
                     style={{ width: 'auto', padding: '8px 16px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}
                   >
                     View <PlayCircle size={16} />
                   </button>
                 )}
              </div>
            </div>

          ))
        )}

      </div>

      {/* PDF Modal Viewer */}
      {selectedPdfUrl && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', padding: '2rem',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontFamily: 'Outfit' }}>Presentation Viewer</h3>
            <button 
              onClick={() => setSelectedPdfUrl(null)}
              className="btn-primary"
              style={{ background: 'rgba(239, 68, 68, 0.8)', padding: '8px 20px' }}
            >
              Close Viewer
            </button>
          </div>
          <iframe 
            src={selectedPdfUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 'none', borderRadius: '12px', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            title="PDF Presentation"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
