import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { UploadCloud, ChevronLeft } from 'lucide-react';

const EditMovie = () => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    date: ''
  });
  const [file, setFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  useEffect(() => {
    if (location.state && location.state.movie) {
      const { title, genre, date, poster_url } = location.state.movie;
      setFormData({
        title: title || '',
        genre: genre || '',
        date: date || '',
        poster_url: poster_url || ''
      });
    } else {
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
    data.append('date', formData.date);
    
    if (file) {
      data.append('pdf', file);
    }
    if (posterFile) {
      data.append('poster', posterFile);
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
        alert('Oups! Échec de la mise à jour de la présentation.');
      }
    } catch (error) {
      console.error(error);
      alert('Le serveur local pourrait être déconnecté!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', position: 'relative' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-forest-ink)', fontWeight: 'bold', marginBottom: '20px', textDecoration: 'none' }}>
        <ChevronLeft size={20} /> RETOUR
      </Link>

      <h2 className="hero-display" style={{ fontSize: '60px', marginBottom: '20px', textAlign: 'center', color: 'var(--color-lipstick-magenta)' }}>
        MODIFIER
      </h2>
      
      <form onSubmit={handleSubmit} className="dark-text-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px' }}>
        <div>
          <label>TITRE DU FILM *</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="ex. Blade Runner 2049" />
        </div>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label>GENRE</label>
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Sci-Fi" />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label>DATE DE PROJECTION</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label>AFFICHE (FILM POSTER)</label>
          <div style={{ border: '2px dashed var(--color-forest-ink)', padding: '20px', textAlign: 'center', borderRadius: 'var(--radius-cards)', background: 'rgba(0,0,0,0.03)' }}>
            <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} style={{ border: 'none', padding: 0 }} />
          </div>
        </div>

        <div>
          <label>NOUVELLE PRÉSENTATION (PDF)</label>
          <div style={{ border: '2px dashed var(--color-forest-ink)', padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-cards)', background: 'rgba(0,0,0,0.03)' }}>
            <UploadCloud size={32} color="var(--color-forest-ink)" style={{ marginBottom: '10px' }} />
            <br />
            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} style={{ border: 'none', padding: 0 }} />
          </div>
        </div>

        <button type="submit" className="gate-pill-btn" disabled={loading} style={{ marginTop: '20px', background: 'var(--color-forest-ink)', color: 'var(--color-warm-chalk)', width: '100%' }}>
          {loading ? 'MISE À JOUR...' : 'METTRE À JOUR'}
        </button>
      </form>
    </div>
  );
};

export default EditMovie;
