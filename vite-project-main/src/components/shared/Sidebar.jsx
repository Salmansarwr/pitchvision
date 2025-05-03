// src/components/shared/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`${isSidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-gray-800 h-full flex flex-col transition-all duration-300`}>
      {/* Toggle Button at Top */}
      <div className="flex items-center justify-center h-16 bg-gray-900 relative">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          {isSidebarOpen ? (
            // Three horizontal lines (hamburger icon)
            <div className="flex flex-col space-y-1.5">
              <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-5 h-0.5 bg-gray-400 rounded"></div>
            </div>
          ) : (
            // Three dots
            <div className="flex flex-col space-y-1.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full mx-auto"></div>
            </div>
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="mt-5 px-2">
          <SidebarItem 
            title="Dashboard" 
            icon="📊" 
            to="/dashboard" 
            active={location.pathname === '/dashboard'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/dashboard')}
          />
          <SidebarItem 
            title="Player Tracking" 
            icon="👥" 
            to="/player-tracking" 
            active={location.pathname === '/player-tracking'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/player-tracking')}
          />
          <SidebarItem 
            title="Event Detection" 
            icon="⚽" 
            to="/event-detection" 
            active={location.pathname === '/event-detection'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/event-detection')}
          />
          <SidebarItem 
            title="Tactical Analysis" 
            icon="📋" 
            to="/tactical-analysis" 
            active={location.pathname === '/tactical-analysis'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/tactical-analysis')}
          />
          <SidebarItem 
            title="Match Reports" 
            icon="📈" 
            to="/match-reports" 
            active={location.pathname === '/match-reports'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/match-reports')}
          />
          <SidebarItem 
            title="Settings" 
            icon="⚙️" 
            to="/settings" 
            active={location.pathname === '/settings'} 
            isSidebarOpen={isSidebarOpen}
            onClick={() => handleNavigation('/settings')}
          />
        </nav>
      </div>
    </div>
  );
}

function SidebarItem({ title, icon,  active = false, isSidebarOpen, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={onClick}
        className={`flex items-center w-full px-2 py-2.5 text-sm font-medium rounded-md mb-1 transition-colors duration-200 ${
          active 
            ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-800' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        <span className="mr-3 h-5 w-5 rounded-full bg-opacity-30 flex items-center justify-center">
          {icon}
        </span>
        {isSidebarOpen && title}
      </button>
      {/* Tooltip for Collapsed Sidebar Items */}
      {!isSidebarOpen && isHovered && (
        <div className="absolute left-16 bg-gray-700 text-white text-sm px-3 py-1 rounded shadow-lg z-50">
          {title}
          {/* Tooltip Arrow */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-700"></div>
        </div>
      )}
    </div>
  );
}

// PropTypes
SidebarItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  active: PropTypes.bool,
  isSidebarOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Sidebar;