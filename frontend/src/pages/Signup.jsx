import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartPulse, Mail, Lock, User, Phone, AlertCircle, Activity } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Sending data to backend DB
      const res = await axios.post('http://localhost:8000/api/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (res.data.success) {
        // Save current active session only
        localStorage.setItem('lifetag_user', JSON.stringify(res.data.data));
        window.dispatchEvent(new Event('storage'));
        navigate('/create');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-rose-600 p-2.5 rounded-2xl text-white shadow-lg shadow-rose-200">
              <HeartPulse className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Sign up to create your medical profile</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-3 border border-red-100 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Pritam Pandey" className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="pritam@example.com" className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Phone Number</label>
            <div className="flex gap-2">
              <select className="px-3 py-3.5 border-2 border-slate-100 rounded-2xl bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:border-rose-500">
                <option value="+91">+91</option>
              </select>
              <div className="relative flex-1 group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="98765 43210" className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Create a strong password" className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all bg-slate-50 focus:bg-white text-sm font-medium" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 mt-2">
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Already have an account? <Link to="/login" className="text-rose-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;