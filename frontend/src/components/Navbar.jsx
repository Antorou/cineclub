import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { activeUser, logout } = useContext(UserContext);

  return (
    <>
      <Link to="/" style={{
        position: 'fixed', top: '40px', right: '40px', width: '50px', height: '50px',
        backgroundColor: 'var(--color-lipstick-magenta)', borderRadius: '9999px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        color: 'var(--color-warm-chalk)', fontWeight: 700, fontSize: '24px',
        boxShadow: 'none', border: 'none'
      }}>
        ⚡
      </Link>
      
      <div style={{
        position: 'fixed', top: '40px', left: '40px', width: '50px', height: '50px',
        backgroundColor: 'var(--color-lipstick-magenta)', borderRadius: '9999px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        color: 'var(--color-warm-chalk)'
      }}>
        {activeUser ? (
          <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-clash-grotesk)' }}>
            X
          </button>
        ) : (
          <Link to="/login" style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-clash-grotesk)' }}>
            O
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
