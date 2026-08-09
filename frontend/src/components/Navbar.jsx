import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('lifetag_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // FIX: Using event listener instead of watching location.pathname to prevent render loops
  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem('lifetag_user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lifetag_user');
    window.dispatchEvent(new Event('storage')); // Notify Navbar to update instantly
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 transition-all duration-300 shadow-sm shadow-slate-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-linear-to-br from-rose-500 to-rose-600 p-2.5 rounded-2xl text-white group-hover:scale-105 transition-transform shadow-lg shadow-rose-600/25">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">LifeTag</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <Link to="/" className="hover:text-rose-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-600 hover:after:w-full after:transition-all">Home</Link>
          <a href="/#how-it-works" className="hover:text-rose-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-600 hover:after:w-full after:transition-all">How It Works</a>
          <a href="/#features" className="hover:text-rose-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-rose-600 hover:after:w-full after:transition-all">Features</a>
        </div>

        {/* Auth State in Navbar */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm group"
            >
              <div className="w-7 h-7 rounded-xl bg-linear-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              {/* FIX: Replaced max-w-[120px] with canonical Tailwind class max-w-30 */}
              <span className="font-bold text-slate-800 text-xs sm:text-sm truncate max-w-30">
                {user.fullName || 'User'}
              </span>
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="text-slate-700 font-extrabold text-xs sm:text-sm px-4 py-2.5 hover:text-rose-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="bg-linear-to-r from-rose-600 to-rose-700 text-white px-5 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm hover:from-rose-700 hover:to-rose-800 hover:shadow-lg hover:shadow-rose-600/25 transition-all active:scale-95 shadow-md shadow-rose-600/20">
              Sign Up
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;