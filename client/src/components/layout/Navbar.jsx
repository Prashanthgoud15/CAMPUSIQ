import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bot, LogOut, Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

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
    <div className="h-full flex items-center justify-between px-2 lg:px-8 bg-gpcet-navbar lg:border-b border-gpcet-border w-full">
      <h2 className="text-lg lg:text-xl font-bold text-gpcet-text tracking-tight truncate mr-2">{getPageTitle()}</h2>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gpcet-muted hover:text-gpcet-text hover:bg-gpcet-card transition-all border border-transparent hover:border-gpcet-border"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

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
    </div>
  );
};

export default Navbar;
