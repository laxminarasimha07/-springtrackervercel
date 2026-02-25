import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../api';

function Navbar({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('username');
      onLogout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <h1>💰 Expense Tracker</h1>
      
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <span>Welcome, {username}!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;