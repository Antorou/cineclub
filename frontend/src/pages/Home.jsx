import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Scorecard from '../components/Scorecard';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Confetti Card Colors Array
const CONFETTI_COLORS = [
  'var(--color-bubblegum-pink)',
  'var(--color-matcha-cream)',
  'var(--color-magenta-punch)',
  'var(--color-firecracker-red)'
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
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '80px', position: 'relative' }}>
        <h2 className="hero-display" style={{
          fontSize: 'clamp(80px, 15vw, 244px)', // Responsive text sizing keeping the massive poster scale
          margin: 0,
          color: 'var(--color-hi-vis-yellow)',
          padding: '0 20px',
          position: 'relative',
          zIndex: 2
        }}>
          SUNDAY<br /><span style={{ color: 'var(--color-buttery-yellow)'}}>CINECLUB</span>
        </h2>

        {/* Cartoon Mascot Placeholder */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-30%, -60%)', zIndex: 1 }}>
           <svg width="250" height="250" viewBox="0 0 100 100" fill="var(--color-bone-white)" stroke="var(--color-ink-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Rabbit 1 (Left) */}
              <ellipse cx="28" cy="35" rx="4.5" ry="16" transform="rotate(-15 28 35)" />
              <ellipse cx="42" cy="35" rx="4.5" ry="16" transform="rotate(10 42 35)" />
              <ellipse cx="35" cy="75" rx="18" ry="22" />
              <circle cx="35" cy="55" r="14" />
              <circle cx="29" cy="53" r="1.5" fill="var(--color-ink-black)" stroke="none" />
              <circle cx="41" cy="53" r="1.5" fill="var(--color-ink-black)" stroke="none" />
              <path d="M 33 58 Q 35 60 37 58" fill="none" />
              <path d="M 35 56 V 58" fill="none" />
              <line x1="14" y1="52" x2="20" y2="54" strokeWidth="1" />
              <line x1="13" y1="56" x2="20" y2="56" strokeWidth="1" />
              <line x1="50" y1="54" x2="56" y2="52" strokeWidth="1" />
              <line x1="50" y1="56" x2="57" y2="56" strokeWidth="1" />
              
              {/* Rabbit 2 (Right, leaning slightly) */}
              <ellipse cx="58" cy="45" rx="3.5" ry="13" transform="rotate(-20 58 45)" />
              <ellipse cx="70" cy="42" rx="3.5" ry="13" transform="rotate(25 70 42)" />
              <ellipse cx="65" cy="80" rx="14" ry="18" />
              <circle cx="65" cy="62" r="11" />
              <circle cx="60" cy="60" r="1.3" fill="var(--color-ink-black)" stroke="none" />
              <circle cx="70" cy="60" r="1.3" fill="var(--color-ink-black)" stroke="none" />
              <path d="M 63 64 Q 65 66 67 64" fill="none" />
              <path d="M 65 63 V 64" fill="none" />
              <line x1="49" y1="59" x2="54" y2="60" strokeWidth="1" />
              <line x1="76" y1="60" x2="81" y2="59" strokeWidth="1" />
           </svg>
        </div>

        <div style={{ marginTop: '40px', position: 'relative', zIndex: 3 }}>
          <Link to="/upload" className="display-outline-btn">
            AJOUTE TON FILM
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '40px',
        padding: '0 40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        {loading ? (
          <p className="mono-text" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-bone-white)' }}>CHARGEMENT...</p>
        ) : movies.length === 0 ? (
          <div className="dark-text-card" style={{ gridColumn: '1 / -1', textAlign: 'center', background: 'transparent', border: '3px dashed var(--color-bone-white)', color: 'var(--color-bone-white)' }}>
            <p className="mono-text" style={{ fontSize: '16px' }}>AUCUNE PRÉSENTATION. AJOUTEZ LA PREMIÈRE !</p>
          </div>
        ) : (
          movies.map((movie, index) => {
            // Pick a confetti color based on the index
            const surfaceColor = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
            // All cards are now dark, so we force light text.
            const textColor = 'var(--color-ink-black)';

            return (
              <div key={movie.id} className="confetti-card" style={{ backgroundColor: surfaceColor, color: textColor }}>
                <h3 className="hero-display" style={{ fontSize: '40px', margin: '0 0 10px 0', lineHeight: 1 }}>{movie.title}</h3>

                {movie.poster_url && (
                  <div style={{ width: '100%', height: '300px', marginBottom: '20px', borderRadius: '4px', overflow: 'hidden', border: `2px solid ${textColor}` }}>
                    <img src={movie.poster_url} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                  <span className="mono-label" style={{ borderColor: textColor }}>{movie.genre || 'AUCUN'}</span>
                  {movie.date && <span className="mono-label" style={{ borderColor: textColor, backgroundColor: 'rgba(0,0,0,0.05)' }}>{new Date(movie.date).toLocaleDateString()}</span>}
                  <span className="mono-label" style={{ backgroundColor: 'transparent', border: '1px solid transparent' }}>PAR <strong style={{ fontFamily: 'var(--font-degulardisplay-bold)' }}>{movie.presenter}</strong></span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span className="mono-label" style={{ background: textColor, color: surfaceColor, borderColor: textColor }}>
                      ★ {(movie.antoine_score !== null && movie.antoine_score !== undefined || movie.lea_score !== null && movie.lea_score !== undefined)
                         ? (((movie.antoine_score || 0) + (movie.lea_score || 0)) / ((movie.antoine_score !== null && movie.antoine_score !== undefined ? 1 : 0) + (movie.lea_score !== null && movie.lea_score !== undefined ? 1 : 0))).toFixed(1)
                         : 'N/A'}
                   </span>

                   <div style={{ display: 'flex', gap: '8px' }}>
                     {activeUser === movie.presenter && (
                       <>
                         <Link
                           to={`/edit/${movie.id}`}
                           state={{ movie }}
                           style={{ padding: '8px', color: textColor, opacity: 0.7 }}
                         >
                           <Pencil size={18} />
                         </Link>
                         <button
                           onClick={() => handleDelete(movie.id)}
                           style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: textColor, opacity: 0.7 }}
                         >
                           <Trash2 size={18} />
                         </button>
                       </>
                     )}
                     {movie.diaporama_url && (
                       <button
                         onClick={() => {
                            setSelectedPdfUrl(movie.diaporama_url);
                            setSelectedPdfTitle(movie.title);
                            setPageNumber(1);
                            setPdfError(null);
                         }}
                         className="gate-pill-btn"
                         style={{ padding: '8px 16px', fontSize: '12px' }}
                       >
                         VOIR
                       </button>
                     )}
                   </div>
                </div>

                {/* Embedded simplified scorecard */}
                <div style={{ marginTop: '20px', borderTop: `1px solid ${textColor}`, paddingTop: '20px', opacity: 0.9 }}>
                  <Scorecard movie={movie} token={token} activeUser={activeUser} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PDF Modal Viewer */}
      {selectedPdfUrl && (
        <div ref={viewerRef} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-ink-black)', zIndex: 1000,
          display: 'flex', flexDirection: 'column', padding: '17px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '17px', alignItems: 'center' }}>
            <h3 className="hero-display" style={{ color: 'var(--color-hi-vis-yellow)', fontSize: '30px', margin: 0 }}>{selectedPdfTitle}</h3>
            <div style={{ display: 'flex', gap: '17px' }}>
              <button onClick={toggleFullscreen} className="gate-pill-btn" style={{ padding: '8px 16px', fontSize: '14px' }}>
                PLEIN ÉCRAN (F)
              </button>
              <button
                onClick={() => {
                  setSelectedPdfUrl(null);
                  if (document.fullscreenElement) document.exitFullscreen();
                }}
                className="gate-pill-btn"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                FERMER (Échap)
              </button>
            </div>
          </div>
          <div style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--color-bone-white)',
            borderRadius: '6px',
            position: 'relative'
          }}>
            {pdfError && <div style={{ color: 'var(--color-firecracker-red)', textAlign: 'center', fontFamily: 'var(--font-degularvariable)' }}><h3>Échec du chargement du PDF</h3><p className="mono-text">{pdfError}</p></div>}
            {!pdfError && (
              <Document
                file={selectedPdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => setPdfError(error.message)}
                loading={<div className="mono-text" style={{ color: 'var(--color-ink-black)' }}>EN ATTENTE DU PDF...</div>}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="pdf-page"
                />
              </Document>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '17px', marginTop: '17px', color: 'var(--color-bone-white)' }}>
             <button
               onClick={() => setPageNumber(p => Math.max(p - 1, 1))}
               disabled={pageNumber <= 1}
               className="display-outline-btn"
               style={{ padding: '8px 16px' }}
             >
               <ChevronLeft size={18} /> PRÉC
             </button>
             <span className="mono-label" style={{ border: 'none', fontSize: '14px' }}>PAGE {pageNumber} SUR {numPages || '?'}</span>
             <button
               onClick={() => setPageNumber(p => Math.min(p + 1, numPages || 1))}
               disabled={pageNumber >= (numPages || 1)}
               className="display-outline-btn"
               style={{ padding: '8px 16px' }}
             >
               SUIV <ChevronRight size={18} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
