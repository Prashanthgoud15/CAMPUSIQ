import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bot, LogOut, Upload, Grid } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { logout as logoutService } from '../../services/authService';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch(err) {
      console.error(err);
    }
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all ${
      isActive
        ? 'bg-blue-500/10 text-blue-400 border-l-4 border-blue-500'
        : 'text-gpcet-muted hover:bg-gpcet-bg hover:text-gpcet-text border-l-4 border-transparent'
    }`;

  const adminNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition-all ${
      isActive
        ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500'
        : 'text-gpcet-muted hover:bg-gpcet-bg hover:text-gpcet-text border-l-4 border-transparent'
    }`;

  return (
    <div className="h-full flex flex-col justify-between bg-gpcet-sidebar">
      <div>
        {/* Top Section */}
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-black text-gpcet-primary tracking-tight">GPCET</h1>
          <p className="text-sm font-medium text-gpcet-accent opacity-80 mt-0.5">CampusIQ</p>
        </div>
        
        <div className="px-6 mb-6">
          <div className="h-px w-full bg-gpcet-border"></div>
        </div>

        {/* User Info Card */}
        {user?.role === 'student' ? (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gpcet-bg rounded-xl border border-gpcet-border">
              <div className="w-10 h-10 rounded-full bg-gpcet-primary flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner">
                {user?.avatar_initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">{user?.display_name}</p>
                <p className="text-gpcet-muted text-[11px] truncate mt-0.5">{user?.branch} · Year {user?.year} · Sem {user?.semester}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gpcet-muted text-[10px] font-mono">{user?.roll_number}</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400">
                    {user?.regulation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gpcet-bg rounded-xl border border-gpcet-border">
              <div className="w-10 h-10 rounded-full bg-gpcet-accent flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">Admin Panel</p>
                <p className="text-gpcet-muted text-[11px] truncate mt-0.5">Manage Platform</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {user?.role === 'student' ? (
            <>
              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard size={18} />
                <span className="font-medium text-sm">Dashboard</span>
              </NavLink>
              <NavLink to="/notes" className={navItemClass}>
                <BookOpen size={18} />
                <span className="font-medium text-sm">Notes Vault</span>
              </NavLink>
              <NavLink to="/meera" className={navItemClass}>
                <Bot size={18} className="text-gpcet-accent" />
                <span className="font-medium text-sm">Ask Meera</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/admin" end className={adminNavClass}>
                <LayoutDashboard size={18} />
                <span className="font-medium text-sm">Dashboard</span>
              </NavLink>
              <NavLink to="/admin/upload" className={adminNavClass}>
                <Upload size={18} />
                <span className="font-medium text-sm">Upload Notes</span>
              </NavLink>
              <NavLink to="/admin/notes" className={adminNavClass}>
                <Grid size={18} />
                <span className="font-medium text-sm">All Notes</span>
              </NavLink>
            </>
          )}

          <div className="mx-6 my-4 h-px bg-gpcet-border"></div>

          <button onClick={handleLogout} className="flex items-center gap-3 w-[calc(100%-16px)] text-left px-4 py-3 mx-2 rounded-lg text-gpcet-muted hover:bg-red-500/10 hover:text-red-400 group transition-all">
            <LogOut size={18} className="group-hover:text-red-400" />
            <span className="font-medium text-sm mr-auto">Logout</span>
          </button>
        </nav>
      </div>

      <div className="p-6 text-center">
        <p className="text-[11px] font-medium text-gpcet-muted">Built for GPCET · R23</p>
      </div>
    </div>
  );
};

export default Sidebar;
