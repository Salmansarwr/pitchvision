import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import LogoGlow from './LogoGlow';

function Header({ title = "Dashboard" }) {
  const { user } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    const initials = names
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join('');
    return initials || 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-gray-800 shadow-md flex items-center px-6">
      <div className="flex items-center">
        <LogoGlow size="small" />
        <h1 className="text-white text-xl font-semibold ml-4">{title}</h1>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(user?.name)}
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ml-1 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
              <a 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Profile
              </a>
              <div className="border-t border-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;