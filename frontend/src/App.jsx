import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Phone, MapPin, Activity, Mic, MicOff, HeartPulse } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import CreateProfile from './pages/CreateProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const PublicSosPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Click mic to enable Voice SOS');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/profiles/id/${id}`);
        if (res.data.success) {
          setProfile(res.data.data);
        }
      } catch {
        setError('Medical profile not found or invalid QR code.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const toggleVoiceListener = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Voice Recognition.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setVoiceStatus('Voice SOS stopped.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus('Listening for emergency words...');
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[event.results.length - 1][0].transcript.toLowerCase();
      if (speechToText.includes('help') || speechToText.includes('emergency') || speechToText.includes('bachao')) {
        setVoiceStatus('🚨 Emergency Keyword Detected!');
        triggerEmergencySOS();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus('Voice recognition error.');
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const triggerEmergencySOS = async () => {
    if (!profile) return;
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          await axios.post(`http://localhost:8000/api/alerts/${profile._id}`, {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          alert('🚨 EMERGENCY SOS SENT TO CONTACTS!');
        }, async () => {
          await axios.post(`http://localhost:8000/api/alerts/${profile._id}`, { latitude: null, longitude: null });
          alert('🚨 EMERGENCY SOS SENT!');
        });
      }
    } catch {
      alert('Failed to dispatch alert.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Activity className="w-10 h-10 text-rose-600 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md w-full border border-slate-100 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
          <h1 className="text-xl font-black text-slate-900">Profile Not Found</h1>
          <p className="text-slate-500 text-sm">{error || 'This LifeTag profile does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <div className="bg-rose-600 text-white rounded-4xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <HeartPulse className="w-4 h-4 animate-pulse" /> Medical Emergency Profile
          </div>
          <h1 className="text-2xl sm:text-4xl font-black wrap-break-word">{profile.fullName}</h1>
          <p className="text-rose-100 font-medium text-xs sm:text-sm mt-1">Scanned via LifeTag QR Code</p>
        </div>

        {/* Voice SOS Widget */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`p-3 rounded-2xl shrink-0 ${isListening ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-100 text-slate-600'}`}>
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-900 text-sm">Hands-Free Voice SOS</h3>
              <p className="text-xs text-slate-500 font-medium truncate">{voiceStatus}</p>
            </div>
          </div>
          <button 
            onClick={toggleVoiceListener}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all ${isListening ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white hover:bg-rose-700'}`}
          >
            {isListening ? 'Stop Listening' : 'Activate Voice SOS'}
          </button>
        </div>

        {/* Quick Emergency Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <a 
            href="tel:112" 
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 sm:p-5 rounded-2xl font-black text-center shadow-lg flex items-center justify-center gap-3 text-sm sm:text-base transition-all"
          >
            <Phone className="w-5 h-5 text-rose-500 shrink-0" /> Call National Emergency (112)
          </a>
          <a 
            href={`https://www.google.com/maps/search/hospitals/@22.5726,88.3639,14z`} 
            target="_blank" 
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 sm:p-5 rounded-2xl font-black text-center shadow-lg flex items-center justify-center gap-3 text-sm sm:text-base transition-all"
          >
            <MapPin className="w-5 h-5 shrink-0" /> Find Nearby Hospitals
          </a>
        </div>

        {/* Vitals Grid */}
        <div className="bg-white p-5 sm:p-8 rounded-4xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Blood Group</span>
              <p className="text-lg sm:text-2xl font-black text-rose-600 mt-1">{profile.bloodGroup}</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Age</span>
              <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{profile.age || 'N/A'} yrs</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Gender</span>
              <p className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{profile.gender || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 p-4 sm:p-5 rounded-2xl">
              <h3 className="font-bold text-rose-900 text-xs sm:text-sm mb-1 uppercase tracking-wider">⚠️ Critical Allergies</h3>
              <p className="text-rose-700 text-xs sm:text-sm font-medium">{profile.allergies || 'None specified'}</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 sm:p-5 rounded-2xl">
              <h3 className="font-bold text-blue-900 text-xs sm:text-sm mb-1 uppercase tracking-wider">💊 Current Medications</h3>
              <p className="text-blue-700 text-xs sm:text-sm font-medium">{profile.currentMedications || 'None specified'}</p>
            </div>
          </div>

          {/* Emergency Contacts List */}
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg mb-3">Emergency Contacts</h3>
            <div className="space-y-3">
              {profile.emergencyContacts?.map((contact, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200/80 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{contact.name}</h4>
                      <span className="text-[10px] sm:text-xs text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-bold">{contact.relation}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{contact.phone}</p>
                  </div>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-bold text-xs"
                  >
                    <Phone className="w-4 h-4" /> Call Contact
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create" element={<CreateProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sos/:id" element={<PublicSosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;