import { useState } from 'react';
import { Star } from 'lucide-react';

const Scorecard = ({ movie, token, activeUser }) => {
  const existingScore = activeUser === 'Antoine' ? movie.antoine_score : movie.lea_score;
  const existingReview = activeUser === 'Antoine' ? movie.antoine_review : movie.lea_review;

  const partnerName = activeUser === 'Antoine' ? 'Léa' : 'Antoine';
  const partnerScore = activeUser === 'Antoine' ? movie.lea_score : movie.antoine_score;
  const partnerReview = activeUser === 'Antoine' ? movie.lea_review : movie.antoine_review;

  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState(existingScore || 0);
  const [review, setReview] = useState(existingReview || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await fetch(`${API_URL}/api/movies/${movie.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score, review })
      });

      if (!response.ok) throw new Error('Failed to update scorecard');

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la mise à jour de la note ! Le backend est-il en cours d\'exécution ?');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 className="mono-text" style={{ fontSize: '14px', margin: 0 }}>VOTRE AVIS</h4>
          <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: '1px solid currentColor', borderRadius: '100px', cursor: 'pointer', padding: '4px 10px', fontSize: '10px', fontFamily: 'var(--font-bergenmonoregular)', color: 'inherit' }}>
            {existingScore !== null && existingScore !== undefined ? 'MODIFIER' : 'AJOUTER UN AVIS'}
          </button>
        </div>

        {existingScore !== null && existingScore !== undefined ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
              <Star size={14} color="currentColor" fill="currentColor" />
              <strong style={{ fontFamily: 'var(--font-degulardisplay-bold)' }}>{existingScore}/10</strong>
            </div>
            {existingReview && <p style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.9 }}>"{existingReview}"</p>}
          </div>
        ) : (
          <p className="mono-text" style={{ fontSize: '12px', opacity: 0.7 }}>AUCUN AVIS PUBLIÉ POUR LE MOMENT.</p>
        )}

        {/* Partner's Feedback Block */}
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed currentColor' }}>
          <h4 className="mono-text" style={{ fontSize: '14px', marginBottom: '10px' }}>AVIS DE {partnerName.toUpperCase()}</h4>
          {partnerScore !== null && partnerScore !== undefined ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <Star size={14} color="currentColor" fill="currentColor" />
                <strong style={{ fontFamily: 'var(--font-degulardisplay-bold)' }}>{partnerScore}/10</strong>
              </div>
              {partnerReview && <p style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.9 }}>"{partnerReview}"</p>}
            </div>
          ) : (
            <p className="mono-text" style={{ fontSize: '12px', opacity: 0.7 }}>AUCUN AVIS PUBLIÉ POUR LE MOMENT.</p>
          )}
        </div>
      </div>
    );
  }

  // Edit State
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h4 className="mono-text" style={{ fontSize: '14px' }}>METTRE À JOUR LA NOTE</h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '17px' }}>
        <input
          type="range"
          min="0" max="10"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={{ flex: 1, accentColor: 'currentColor' }}
        />
        <span style={{ fontWeight: 'bold', fontFamily: 'var(--font-degulardisplay-bold)' }}>{score}/10</span>
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="T'en as pensé quoi ?"
        style={{
          width: '100%', padding: '12px', borderRadius: '6px',
          background: 'transparent', color: 'inherit',
          border: '1px solid currentColor', minHeight: '60px',
          fontFamily: 'var(--font-degularvariable)',
          marginTop: '10px'
        }}
      />

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button type="submit" disabled={loading} style={{
          background: 'currentColor', color: 'var(--color-warm-chalk)',
          padding: '8px 16px', borderRadius: '100px', fontSize: '12px',
          fontFamily: 'var(--font-degulardisplay-bold)', flex: 1, border: 'none', cursor: 'pointer'
        }}>
          {loading ? 'SAUVEGARDE...' : 'ENREGISTRER'}
        </button>
        <button type="button" onClick={() => setIsEditing(false)} style={{
          background: 'transparent', border: '1px solid currentColor',
          color: 'inherit', padding: '8px 16px', borderRadius: '100px',
          fontSize: '12px', fontFamily: 'var(--font-degulardisplay-bold)', cursor: 'pointer'
        }}>
          ANNULER
        </button>
      </div>
    </form>
  );
};

export default Scorecard;
