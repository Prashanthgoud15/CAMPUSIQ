import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginService(email, password);
      // data contains accessToken and user 
      login(data.user, data.accessToken);

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gpcet-bg flex flex-col md:flex-row text-gpcet-text font-sans">

      {/* Left Column - Branding */}
      <div className="md:w-2/5 p-8 flex flex-col justify-center bg-gpcet-sidebar border-r border-gpcet-border relative overflow-hidden hidden md:flex">
        {/* Abstract background accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gpcet-primary opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gpcet-nptel opacity-5 blur-3xl"></div>

        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-6xl font-black text-gpcet-primary tracking-tighter mb-4">
            GPCET
          </h1>
          <h2 className="text-2xl font-semibold leading-tight mb-2">
            G. Pullaiah College of <br />Engineering and Technology
          </h2>
          <p className="text-gpcet-muted mb-6">Kurnool, Andhra Pradesh</p>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-gpcet-card border border-gpcet-border text-xs font-medium">
              JNTUA Autonomous
            </span>
            <span className="px-3 py-1 rounded-full bg-gpcet-card border border-gpcet-border text-xs font-medium">
              NAAC A Grade
            </span>
          </div>

          <div className="w-12 h-1 bg-gpcet-border mb-8 rounded"></div>

          <p className="text-lg italic text-gpcet-muted mb-8">
            "Pioneering Education, Engineering the Future"
          </p>

          <p className="text-base text-gray-300 mb-8 font-medium">
            CampusIQ — Your AI-powered study companion built strictly for GPCET students.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-gpcet-primary"></div> Smart Notes Vault
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-gpcet-accent"></div> Meera AI Tutor
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-2 h-2 rounded-full bg-gpcet-nptel"></div> R23 & Legacy Regulations
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-6 sm:p-8 bg-gpcet-bg">
        <div className="w-full max-w-md bg-gpcet-card p-8 rounded-2xl border border-gpcet-border shadow-2xl relative overflow-hidden">

          {/* Decorative bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gpcet-primary via-gpcet-accent to-gpcet-nptel"></div>

          <div className="text-center mb-8 pt-4">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-gpcet-primary text-xs font-bold tracking-wider uppercase mb-4">
              GPCET CampusIQ
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gpcet-muted text-sm">Sign in to access your study materials and AI tutor</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gpcet-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@gpcet.ac.in"
                  className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl py-3.5 pl-12 pr-4 text-gpcet-text placeholder-gray-600 focus:ring-2 focus:ring-gpcet-primary outline-none transition-all text-base sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gpcet-primary transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gpcet-bg border border-gpcet-border rounded-xl py-3.5 pl-12 pr-4 text-gpcet-text placeholder-gray-600 focus:ring-2 focus:ring-gpcet-primary outline-none transition-all text-base sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gpcet-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gpcet-primary hover:bg-blue-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In to CampusIQ'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gpcet-border flex flex-col items-center gap-4">
            {/* <div className="w-full">
              <h4 className="text-xs uppercase text-gpcet-muted font-bold tracking-wider mb-3 text-center">Demo Credentials</h4>
              <div className="bg-gpcet-bg rounded-lg p-3 text-xs text-gpcet-muted space-y-2 font-mono border border-gpcet-border/50">
                <div className="flex justify-between items-center">
                  <span className="bg-gpcet-card px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gpcet-primary">Student</span>
                  <span className="text-gray-400">student@gpcet.ac.in / Student@123</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gpcet-border/50">
                  <span className="bg-gpcet-card px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gpcet-accent">Admin</span>
                  <span className="text-gray-400">admin@gpcet.ac.in / Admin@GPCET123</span>
                </div>
              </div>
            </div> */}

            <Link
              to="/register"
              className="text-sm font-bold text-gpcet-primary hover:text-blue-400 transition-colors flex items-center gap-1 group"
            >
              New student? Create account <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
