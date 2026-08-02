import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Scorecard from '../components/Scorecard';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const HIGHLIGHT_COLORS = [
  'var(--color-lipstick-magenta)',
  'var(--color-bubblegum)',
  'var(--color-blush-cream)'
];

const Home = () => {
  const { activeUser, token, logout } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [selectedPdfTitle, setSelectedPdfTitle] = useState("");
  const viewerRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer définitivement ce film ?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await fetch(`${API_URL}/api/movies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMovies(prev => prev.filter(m => m.id !== id));
      } else {
        alert("Échec de la suppression du film. Vous n'avez peut-être pas la permission.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du film. Veuillez vérifier votre connexion.");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPdfUrl(null);
        if (document.fullscreenElement) document.exitFullscreen();
      }
      if (e.key === 'f' || e.key === 'F') {
        if (selectedPdfUrl) toggleFullscreen();
      }
      if (e.key === 'ArrowRight') {
         setPageNumber(prev => Math.min(prev + 1, numPages || 1));
      }
      if (e.key === 'ArrowLeft') {
         setPageNumber(prev => Math.max(prev - 1, 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPdfUrl, numPages]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    fetch(`${API_URL}/api/movies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          logout();
          throw new Error("Unauthorized - Token Expired");
        }
        return res.json();
      })
      .then(data => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error communicating with Express API!", err);
        setMovies([]);
        setLoading(false);
      });
  }, [token, logout]);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 40px', paddingBottom: '120px' }}>
        <div style={{ marginBottom: '20px' }}>
          <span className="mono-label" style={{ fontSize: 'var(--text-caption)', color: 'var(--color-forest-ink)', letterSpacing: '0.05em' }}>
            AGENCE FOUDRE PRÉSENTE
          </span>
        </div>
        
        <h1 className="hero-display" style={{
          fontSize: 'clamp(80px, 15vw, 230px)',
          margin: 0,
          color: 'var(--color-lipstick-magenta)',
          textAlign: 'left',
          wordWrap: 'break-word',
          maxWidth: '100%'
        }}>
          SUNDAY<br/>CINECLUB
        </h1>

        <div style={{ marginTop: '40px' }}>
          <Link to="/upload" className="underline-link" style={{ fontSize: 'var(--text-body)', fontWeight: 500 }}>
            AJOUTE TON FILM &rarr;
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '0 40px', minHeight: '50vh' }}>
          <p className="mono-text" style={{ fontSize: 'var(--text-body)', color: 'var(--color-forest-ink)' }}>CHARGEMENT...</p>
        </div>
      ) : movies.length === 0 ? (
        <div style={{ padding: '0 40px', minHeight: '50vh' }}>
          <p className="mono-text" style={{ fontSize: 'var(--text-body)', color: 'var(--color-forest-ink)' }}>AUCUNE PRÉSENTATION.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {movies.map((movie, index) => {
            const headlineColor = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
            const alignment = index % 2 === 0 ? 'flex-start' : 'flex-end';

            return (
              <div key={movie.id} style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: alignment,
                padding: '120px 40px',
                borderTop: '1px solid var(--color-blush-cream)'
              }}>
                
                <div style={{ maxWidth: '800px', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-clash-grotesk)', fontWeight: 500, fontSize: 'var(--text-label)', 
                      backgroundColor: 'var(--color-blush-cream)', color: 'var(--color-forest-ink)', 
                      padding: '7px 15px', borderRadius: '9999px', textTransform: 'uppercase'
                    }}>
                      {movie.genre || 'FILM'}
                    </span>
                    {movie.date && (
                      <span style={{ 
                        fontFamily: 'var(--font-clash-grotesk)', fontWeight: 500, fontSize: 'var(--text-label)', 
                        color: 'var(--color-forest-ink)', padding: '7px 0', textTransform: 'uppercase'
                      }}>
                        {new Date(movie.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h2 className="hero-display" style={{ 
                    fontSize: 'clamp(60px, 8vw, 130px)', 
                    color: headlineColor, 
                    margin: '0 0 40px 0' 
                  }}>
                    {movie.title}
                  </h2>

                  {movie.poster_url && (
                    <div style={{ width: '100%', marginBottom: '40px' }}>
                      <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '60ch' }}>
                    <p style={{ fontFamily: 'var(--font-clash-grotesk)', fontSize: 'var(--text-body)', lineHeight: 1.2, color: 'var(--color-forest-ink)' }}>
                      Sélectionné et présenté par <strong style={{ fontWeight: 700 }}>{movie.presenter}</strong>. 
                      Ce film a reçu une note moyenne de <strong style={{ fontWeight: 700 }}>
                      {(movie.antoine_score !== null && movie.antoine_score !== undefined || movie.lea_score !== null && movie.lea_score !== undefined)
                         ? (((movie.antoine_score || 0) + (movie.lea_score || 0)) / ((movie.antoine_score !== null && movie.antoine_score !== undefined ? 1 : 0) + (movie.lea_score !== null && movie.lea_score !== undefined ? 1 : 0))).toFixed(1)
                         : 'N/A'}
                      </strong>.
                    </p>
                    
                    <Scorecard movie={movie} token={token} activeUser={activeUser} />

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      {movie.diaporama_url && (
                        <button
                          onClick={() => {
                             setSelectedPdfUrl(movie.diaporama_url);
                             setSelectedPdfTitle(movie.title);
                             setPageNumber(1);
                             setPdfError(null);
                          }}
                          className="gate-pill-btn"
                        >
                          VOIR LA PRÉSENTATION
                        </button>
                      )}
                      
                      {activeUser === movie.presenter && (
                        <>
                          <Link to={`/edit/${movie.id}`} state={{ movie }} style={{ color: 'var(--color-forest-ink)', padding: '10px' }}>
                            <Pencil size={20} />
                          </Link>
                          <button onClick={() => handleDelete(movie.id)} style={{ padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-forest-ink)' }}>
                            <Trash2 size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PDF Modal Viewer */}
      {selectedPdfUrl && (
        <div ref={viewerRef} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-warm-chalk)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', padding: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
            <h3 className="hero-display" style={{ color: 'var(--color-lipstick-magenta)', fontSize: '46px', margin: 0 }}>{selectedPdfTitle}</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={toggleFullscreen} className="display-outline-btn">
                PLEIN ÉCRAN (F)
              </button>
              <button
                onClick={() => {
                  setSelectedPdfUrl(null);
                  if (document.fullscreenElement) document.exitFullscreen();
                }}
                className="gate-pill-btn"
              >
                FERMER
              </button>
            </div>
          </div>
          <div style={{
            flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'var(--color-blush-cream)', borderRadius: 'var(--radius-2xl)', position: 'relative'
          }}>
            {pdfError && <div style={{ color: 'var(--color-lipstick-magenta)', textAlign: 'center' }}><h3 className="hero-display" style={{ fontSize: '46px' }}>ERREUR</h3><p className="mono-text">{pdfError}</p></div>}
            {!pdfError && (
              <Document
                file={selectedPdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => setPdfError(error.message)}
                loading={<div className="mono-text" style={{ color: 'var(--color-forest-ink)' }}>CHARGEMENT...</div>}
              >
                <Page pageNumber={pageNumber} renderTextLayer={true} renderAnnotationLayer={true} className="pdf-page" />
              </Document>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
             <button onClick={() => setPageNumber(p => Math.max(p - 1, 1))} disabled={pageNumber <= 1} className="display-outline-btn">
               <ChevronLeft size={20} />
             </button>
             <span className="mono-label" style={{ color: 'var(--color-forest-ink)' }}>PAGE {pageNumber} SUR {numPages || '?'}</span>
             <button onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))} disabled={pageNumber >= (numPages || 1)} className="display-outline-btn">
               <ChevronRight size={20} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

