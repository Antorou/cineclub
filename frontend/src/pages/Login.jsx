import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('Antoine');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setError('MOT DE PASSE INCORRECT ! RÉESSAYEZ.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleLogin} className="dark-text-card" style={{ maxWidth: '400px', margin: '100px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <h2 className="hero-display" style={{ fontSize: '60px', margin: 0, textAlign: 'center', color: 'var(--color-lipstick-magenta)' }}>ACCÈS PRIVÉ</h2>
        
        {error && <div className="mono-text" style={{ color: 'var(--color-lipstick-magenta)', textAlign: 'center' }}>{error}</div>}

        <div>
          <label>CHOISIR UN PROFIL</label>
          <select 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', padding: '12px',
              border: '1px solid var(--color-forest-ink)', background: 'transparent', 
              color: 'var(--color-forest-ink)', fontFamily: 'var(--font-clash-grotesk)',
              textAlign: 'center', borderRadius: 'var(--radius-cards)'
            }}
          >
            <option value="Antoine">Antoine</option>
            <option value="Léa">Léa</option>
          </select>
        </div>

        <div>
          <label>MOT DE PASSE</label>
          <input 
            type="password" 
            placeholder="Entrez votre mot de passe" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          onClick={handleLogin}
          className="gate-pill-btn"
          style={{ 
            width: '100%', 
            background: 'var(--color-lipstick-magenta)', 
            color: 'var(--color-warm-chalk)' 
          }}
        >  S'IDENTIFIER
        </button>
      </form>
    </div>
  );
};

export default Login;
