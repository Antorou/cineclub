import { useState } from 'react';
import { Star } from 'lucide-react';

// Teacher Concept: We compartmentalize logic into small reusable Components!
const Scorecard = ({ movie, token, activeUser }) => {
  // Dynamically check if the current user already has a score submitted
  const existingScore = activeUser === 'Antoine' ? movie.antoine_score : movie.lea_score;
  const existingReview = activeUser === 'Antoine' ? movie.antoine_review : movie.lea_review;
  
  // Dynamically extract the partner's scorecard data!
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
      
      // Hit our newly created PUT route perfectly!
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
      // For simplicity in this milestone, we just forcefully refresh the page to pull down the newly updated global array.
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('Could not update scorecard! Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Render the viewing state
  if (!isEditing) {
    return (
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Your Feedback</h4>
          <button onClick={() => setIsEditing(true)} className="btn-switch" style={{ width: 'auto', padding: '4px 12px', fontSize: '0.8rem', borderRadius: '4px' }}>
            {existingScore !== null && existingScore !== undefined ? 'Edit' : 'Add Review'}
          </button>
        </div>
        
        {existingScore !== null && existingScore !== undefined ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Star size={14} color="#ffb703" fill="#ffb703" />
              <strong>{existingScore}/10</strong>
            </div>
            {existingReview && <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{existingReview}"</p>}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No review posted yet.</p>
        )}

        {/* Partner's Feedback Block - Read Only */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{partnerName}'s Feedback</h4>
          {partnerScore !== null && partnerScore !== undefined ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Star size={14} color="#ffb703" fill="#ffb703" />
                <strong>{partnerScore}/10</strong>
              </div>
              {partnerReview && <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{partnerReview}"</p>}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No review posted yet.</p>
          )}
        </div>
      </div>
    );
  }

  // Render the interactive Form state
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)' }}>Update Your Score</h4>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input 
          type="range" 
          min="0" max="10" 
          value={score} 
          onChange={(e) => setScore(e.target.value)} 
          style={{ flex: 1 }}
        />
        <span style={{ fontWeight: 'bold' }}>{score}/10</span>
      </div>

      <textarea 
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your thoughts..."
        style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)', minHeight: '60px', marginTop: '0.2rem' }}
      />
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
        <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1 }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '6px 12px', borderRadius: '999px', fontSize: '0.85rem', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Scorecard;
