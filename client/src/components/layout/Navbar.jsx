import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path === '/notes') return 'Notes Vault';
    if (path === '/meera') return 'Meera AI Tutor';
    if (path === '/admin') return 'Admin Dashboard';
    if (path === '/admin/upload') return 'Upload Materials';
    if (path === '/admin/notes') return 'Manage Notes';
    return '';
  };

  return (
    <div className="h-full flex items-center justify-between px-2 lg:px-8 bg-[#0A0F1E] lg:border-b border-gpcet-border w-full">
      <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight truncate mr-2">{getPageTitle()}</h2>
      
      {!location.pathname.includes('/admin') && location.pathname !== '/meera' && (
        <button 
          onClick={() => navigate('/meera')}
          className="flex items-center gap-2 bg-gpcet-accent/10 hover:bg-gpcet-accent/20 text-gpcet-accent font-semibold py-1.5 lg:py-2 px-3 lg:px-4 rounded-xl transition-all border border-gpcet-accent/20 hover:border-gpcet-accent/40 shrink-0"
        >
          <Bot size={16} />
          <span className="text-xs lg:text-sm hidden sm:inline">Ask Meera &rarr;</span>
          <span className="text-xs sm:hidden">Meera</span>
        </button>
      )}
    </div>
  );
};

export default Navbar;
