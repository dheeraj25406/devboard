import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? 'text-indigo-400'
        : 'devboard-muted hover:text-[#f4f4f5]'
    }`;

  return (
    <nav className="devboard-navbar app-navbar sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/dashboard" className="devboard-heading text-xl font-bold">
          Dev<span className="text-indigo-400">Board</span>
        </Link>
        {user && (
          <div className="flex items-center gap-6">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/projects" className={linkClass}>Projects</NavLink>
            <NavLink to="/github" className={linkClass}>GitHub Import</NavLink>
            <NavLink to={`/dev/${user.username}`} className={linkClass}>Portfolio</NavLink>
            <span className="devboard-dim hidden text-sm sm:inline">@{user.username}</span>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </nav>
  );
}
