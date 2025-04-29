// src/components/shared/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ children, title }) {
  return (
    <div className="flex h-screen bg-gray-900 custom-scrollbar">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;