import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { activeUser, logout } = useContext(UserContext);

  if (!activeUser) return null;

  return (
    <header style={{
      textAlign: 'center',
      padding: '17px',
      position: 'relative'
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--font-obviouslyvariable)',
        fontSize: '30px',
        color: 'var(--color-hi-vis-yellow)',
        lineHeight: 1,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        display: 'inline-block'
      }}>
        lapinous
      </Link>
      <button
        onClick={logout}
        className="underline-link"
        style={{ position: 'absolute', right: '17px', top: '27px', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        DÉCONNEXION [{activeUser}]
      </button>
    </header>
  );
};

export default Navbar;
