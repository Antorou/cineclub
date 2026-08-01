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
      <form onSubmit={handleLogin} className="dark-text-card" style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <h2 className="hero-display" style={{ fontSize: '60px', margin: 0, textAlign: 'center', color: 'var(--color-ink-black)' }}>ACCÈS PRIVÉ</h2>
        
        {error && <div className="mono-text" style={{ color: 'var(--color-firecracker-red)', textAlign: 'center' }}>{error}</div>}

        <div>
          <label>CHOISIR UN PROFIL</label>
          <select 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', padding: '12px', borderRadius: 'var(--radius-cards)', 
              border: '1px solid var(--color-ink-black)', background: 'transparent', 
              color: 'var(--color-ink-black)', fontFamily: 'var(--font-degularvariable)',
              fontSize: '16px'
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

        <button type="submit" className="gate-pill-btn" style={{ 
          marginTop: '20px', 
          width: '100%', 
          background: 'var(--color-dusk-violet)', 
          color: 'var(--color-bone-white)' 
        }}>
          S'IDENTIFIER
        </button>
      </form>
    </div>
  );
};

export default Login;
