// src/components/shared/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoGlow from './LogoGlow';

function Navbar({ transparent = false }) {
  const navigate = useNavigate();

  // Handle navigation
  const handleNavigation = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <header className={`${transparent ? 'bg-transparent' : 'bg-gray-900 border-b border-gray-800'} px-4 py-4 fixed w-full top-0 z-10 shadow-lg`}>
      <div className="container mx-auto flex justify-between items-center">
        <LogoGlow />
        
        <nav className="hidden md:flex space-x-12">
          <NavLink href="/" label="Home" onClick={(e) => handleNavigation('/', e)} />
          <NavLink href="/about" label="About" onClick={(e) => handleNavigation('/about', e)} />
          <NavLink href="/contact" label="Contact" onClick={(e) => handleNavigation('/contact', e)} />
        </nav>
        
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            onClick={(e) => handleNavigation('/login', e)}
            className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            Sign In
          </a>
          <a
            href="/signup"
            onClick={(e) => handleNavigation('/signup', e)}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition shadow-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, label, isActive = false, onClick }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={`transition text-lg ${
        isActive 
          ? 'text-white border-b-2 border-indigo-500 font-medium' 
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {label}
    </a>
  );
}

export default Navbar;