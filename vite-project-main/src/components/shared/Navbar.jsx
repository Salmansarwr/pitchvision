import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoGlow from './LogoGlow';
import { UserContext } from '../../context/UserContext';

function Navbar({ transparent = false }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header
      className={`${
        transparent ? 'bg-transparent' : 'bg-gray-900 border-b border-gray-800'
      } px-4 py-4 fixed w-full top-0 z-10 shadow-lg`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <LogoGlow />

        <nav className="hidden md:flex space-x-12">
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/player-tracking" label="Player Tracking" />
          <NavLink to="/event-detection" label="Event Detection" />
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition shadow-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, label }) {
  return (
    <Link
      to={to}
      className="transition text-lg text-gray-300 hover:text-white"
    >
      {label}
    </Link>
  );
}

export default Navbar;