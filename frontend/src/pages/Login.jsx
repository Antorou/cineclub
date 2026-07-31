import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Lock } from 'lucide-react';

const Login = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('Antoine');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Await the genuine API network request!
    const success = await login(username, password);
    if (!success) {
      setError('Incorrect database password! Try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleLogin} className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '420px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-color)', padding: '15px', borderRadius: '50%', boxShadow: '0 0 30px var(--accent-glow)' }}>
            <Lock size={32} color="white" />
          </div>
        </div>
        
        <h2 className="text-gradient" style={{ fontSize: '2rem' }}>Private Access</h2>
        <p style={{ color: 'var(--text-muted)' }}>Select your profile to continue.</p>

        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}

        <select 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '1.1rem' }}
        >
          <option value="Antoine">Antoine</option>
          <option value="Léa">Léa</option>
        </select>

        <input 
          type="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1.1rem' }}
        />

        <button type="submit" className="btn-primary" style={{ padding: '14px', fontSize: '1.1rem', marginTop: '1rem' }}>
          Unlock Cinéclub
        </button>
      </form>
    </div>
  );
};

export default Login;
