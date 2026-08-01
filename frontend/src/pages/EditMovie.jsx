import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';

const EditMovie = () => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration_minutes: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Check if movie data was passed via Link state
    if (location.state && location.state.movie) {
      const { title, genre, duration_minutes } = location.state.movie;
      setFormData({
        title: title || '',
        genre: genre || '',
        duration_minutes: duration_minutes || ''
      });
    } else {
      // It's possible someone just typed the URL, ideally fetch the movie by ID here, 
      // but without a GET /api/movies/:id route, we redirect home for simplicity.
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('genre', formData.genre);
    data.append('duration_minutes', formData.duration_minutes);
    
    if (file) {
      data.append('pdf', file);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await fetch(`${API_URL}/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Oops! Failed to dynamically update presentation.');
      }
    } catch (error) {
      console.error(error);
      alert('Local server might be offline!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        Edit Presentation
      </h2>
      
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Movie Title *</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} 
            placeholder="e.g. Blade Runner 2049"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Genre</label>
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Sci-Fi"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Duration (mins)</label>
            <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} placeholder="164"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>New PDF Presentation (Optional)</label>
          <div style={{ border: '2px dashed var(--accent-color)', padding: '2rem', textAlign: 'center', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
            <UploadCloud size={32} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <br />
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} style={{ color: 'var(--text-main)' }} />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '14px', fontSize: '1.1rem' }}>
          {loading ? 'Saving changes...' : `Update File`}
        </button>
      </form>
    </div>
  );
};

export default EditMovie;
