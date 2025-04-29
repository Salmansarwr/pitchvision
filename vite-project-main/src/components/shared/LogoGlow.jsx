// src/components/shared/LogoGlow.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LogoGlow({ size = "default", linkTo = "/dashboard" }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Size variations
  const sizes = {
    small: {
      container: "h-8 w-8",
      svg: "h-5 w-5",
      text: "text-lg"
    },
    default: {
      container: "h-12 w-12",
      svg: "h-8 w-8",
      text: "text-2xl"
    },
    large: {
      container: "h-16 w-16",
      svg: "h-10 w-10",
      text: "text-3xl"
    }
  };
  
  const currentSize = sizes[size] || sizes.default;
  
  // Handle navigation without Link component (alternative approach)
  const handleLogoClick = (e) => {
    e.preventDefault();
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('user') !== null;
    
    // Navigate to dashboard if authenticated, otherwise to landing page
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };
  
  return (
    <a href="#" onClick={handleLogoClick} className="flex items-center">
      <div 
        className={`${currentSize.container} bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3 relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glow effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-md transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
          style={{ transform: 'scale(1.35)' }}
        ></div>
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.svg} text-white relative z-10`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        
        {/* Subtle pulsing animation for the icon */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg opacity-75 animate-pulse"></div>
      </div>
      <span className={`text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ${currentSize.text} font-bold tracking-wide`}>
        PITCH VISION
      </span>
    </a>
  );
}

export default LogoGlow;