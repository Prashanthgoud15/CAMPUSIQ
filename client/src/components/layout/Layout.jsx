import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Menu } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="flex h-screen bg-[#050810] overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop fixed, Mobile slide-in */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Navbar Wrapper */}
        <div className="h-16 shrink-0 flex items-center bg-[#0A0F1E] border-b border-gpcet-border lg:hidden px-4 shadow-xl z-20">
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="p-2 mr-3 text-gpcet-muted hover:text-white bg-white/5 rounded-lg transition-colors border border-white/10"
           >
             <Menu size={20} />
           </button>
           <div className="flex-1 h-full"><Navbar /></div>
        </div>
        <div className="hidden lg:block h-16 shrink-0 z-20"><Navbar /></div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto custom-scrollbar relative z-10 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
