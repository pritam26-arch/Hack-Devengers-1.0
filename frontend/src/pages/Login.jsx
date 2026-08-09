import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, Mail, Lock, ShieldCheck, AlertCircle, Activity, KeyRound, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // UI View State: 'login' | 'forgot' | 'reset'
  const [view, setView] = useState('login');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Status States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ================= 1. NORMAL LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('lifetag_user', JSON.stringify(res.data.data));
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // ================= 2. SEND OTP =================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccess('OTP sent! Check your email.');
        setTimeout(() => {
          setSuccess('');
          setView('reset');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ================= 3. RESET PASSWORD =================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/auth/reset-password', { email, otp, newPassword });
      if (res.data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          setSuccess('');
          setPassword('');
          setView('login'); // Go back to login screen
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-rose-600 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200">
              <HeartPulse className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {view === 'login' ? 'Welcome Back' : view === 'forgot' ? 'Reset Password' : 'Enter OTP'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {view === 'login' ? 'Login to access your medical profile' : 
             view === 'forgot' ? 'Enter your email to receive an OTP' : 
             'Check your email for the 6-digit OTP'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 font-medium animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-emerald-100 font-medium animate-in fade-in">
            <ShieldCheck className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        {/* VIEW 1: NORMAL LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="text-xs font-bold text-rose-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70">
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Login'}
            </button>

            <p className="text-center text-sm font-medium text-slate-500 mt-8">
              Don't have an account? <Link to="/signup" className="text-rose-600 font-bold hover:underline">Sign Up</Link>
            </p>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD (EMAIL INPUT) */}
        {view === 'forgot' && (
          <form onSubmit={handleSendOTP} className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Registered Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70">
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Send Recovery OTP'}
            </button>

            <button type="button" onClick={() => setView('login')} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mt-4">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </form>
        )}

        {/* VIEW 3: RESET PASSWORD (OTP & NEW PASSWORD) */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">6-Digit OTP</label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP from email" maxLength="6" className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-bold tracking-widest" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create new password" className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70">
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Reset & Login'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;