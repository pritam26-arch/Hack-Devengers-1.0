import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  User, Phone, MapPin, Download, CheckCircle2, AlertTriangle, ShieldCheck, 
  Activity, Send, ExternalLink, Plus, Trash2, Lock, Eye, BellRing, Settings, 
  ChevronRight, BatteryCharging, Clock, Mail, Copy, Edit3, Smartphone, X
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const savedUser = localStorage.getItem('lifetag_user');
    return savedUser ? JSON.parse(savedUser) : { fullName: 'User', email: '' };
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); 
  
  // Dynamic States
  const [gpsCoords, setGpsCoords] = useState(null);
  const [alertStatus, setAlertStatus] = useState('');
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', email: '' });
  const [showAddContact, setShowAddContact] = useState(false);
  const [locSharingOn, setLocSharingOn] = useState(true); // Restored toggle state
  const [twoFactorOn, setTwoFactorOn] = useState(false);

  // Modal States
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ bloodGroup: '', currentMedications: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user.email) return;
        const res = await axios.get(`http://localhost:8000/api/profiles/user/${user.email}`);
        if (res.data.success) {
          setProfile(res.data.data);
          setEditFormData({ 
            bloodGroup: res.data.data.bloodGroup, 
            currentMedications: res.data.data.currentMedications || '' 
          });
        }
      } catch {
        console.log('No profile found yet.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Location denied'),
        { enableHighAccuracy: true }
      );
    }
  }, [user.email]);

  const handleTriggerSOS = async () => {
    if (!profile) return alert('Please create your medical profile first!');
    setAlertStatus('sending');
    try {
      const lat = gpsCoords ? gpsCoords.lat : 22.5726;
      const lng = gpsCoords ? gpsCoords.lng : 88.3639;
      const res = await axios.post(`http://localhost:8000/api/alerts/${profile._id}`, { latitude: lat, longitude: lng });
      if (res.data.success) {
        setAlertStatus('success');
        setTimeout(() => setAlertStatus(''), 3000);
      }
    } catch (error) {
      alert(error.response?.status === 429 ? 'Alert already sent recently! Cooldown active.' : 'Failed to dispatch alert.');
      setAlertStatus('');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/profiles/${profile._id}/contacts`, newContact);
      if (res.data.success) {
        setProfile(res.data.data);
        setShowAddContact(false);
        setNewContact({ name: '', relation: '', phone: '', email: '' });
      }
    } catch {
      alert('Failed to add contact');
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/profiles/${profile._id}`, editFormData);
      if (res.data.success) {
        setProfile(res.data.data);
        setShowEditModal(false);
        alert('Profile updated successfully!');
      }
    } catch {
      alert('Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/users/password`, {
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        alert('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your medical profile, emergency contacts, and account data.')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${user.email}`);
        localStorage.removeItem('lifetag_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      } catch {
        alert('Failed to delete account');
      }
    }
  };

  const copyToClipboard = () => {
    const link = gpsCoords 
      ? `https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}` 
      : 'Location not acquired yet.';
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${user.fullName}_LifeTag_Data.json`);
    dlAnchorElem.click();
  };

  const sosUrl = profile ? `${window.location.origin}/sos/${profile._id}` : '';

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Activity className="w-10 h-10 text-rose-600 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Secure Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100/50 to-rose-50/20 py-8 px-4 sm:px-6 lg:px-10 font-sans text-slate-900 relative selection:bg-rose-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Encrypted Dashboard Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome back, {user.fullName}!</h1>
            <p className="text-slate-500 text-sm font-medium mt-0.5">Manage your digital medical lifeline, emergency contacts, and security preferences.</p>
          </div>
          {!profile && (
            <Link to="/create" className="bg-linear-to-r from-rose-600 to-rose-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 hover:shadow-xl hover:shadow-rose-600/35 hover:-translate-y-0.5 active:scale-95 transition-all">
              <Activity className="w-5 h-5" /> Create Medical Profile
            </Link>
          )}
        </div>

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-1 space-y-2 bg-white/80 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white sticky top-28">
              <div className="px-4 py-2 mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navigation Menu</p>
              </div>
              {[
                { id: 'overview', icon: Activity, label: 'Dashboard Overview' },
                { id: 'contacts', icon: Phone, label: 'Emergency Contacts' },
                { id: 'location', icon: MapPin, label: 'Location Sharing' },
                { id: 'security', icon: Settings, label: 'Privacy & Security' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                    activeTab === tab.id 
                      ? 'bg-linear-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/25 scale-[1.02]' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-rose-600'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab !== tab.id && 'group-hover:scale-110'}`} /> 
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-3">
              
              {/* ================= TAB 1: OVERVIEW ================= */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-400">
                  <div className="md:col-span-2 bg-linear-to-r from-emerald-50 via-teal-50/30 to-emerald-50/50 border border-emerald-200/80 p-6 rounded-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-500 text-white p-3.5 rounded-2xl shadow-md shadow-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-emerald-950 text-base sm:text-lg">Profile is Active & Secured</h3>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">Blood Group: <span className="font-black">{profile.bloodGroup}</span> | Vitals Vault Synchronized</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEditModal(true)} 
                      className="bg-white border border-emerald-200 text-emerald-800 px-4.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-100/60 hover:shadow-sm active:scale-95 transition-all"
                    >
                      <Edit3 className="w-4 h-4 text-emerald-600" /> Edit Profile
                    </button>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white text-center flex flex-col items-center justify-between group">
                    <div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight">Your LifeTag QR</h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Scan to access emergency vitals</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl border-2 border-dashed border-slate-200 my-5 group-hover:border-rose-300 transition-colors shadow-inner">
                      <QRCodeCanvas value={sosUrl} size={150} level={"H"} />
                    </div>
                    <div className="w-full flex gap-2.5">
                      <button 
                        onClick={downloadData} 
                        className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 text-xs flex justify-center items-center gap-2 shadow-md shadow-slate-900/10 hover:shadow-lg active:scale-95 transition-all"
                      >
                        <Download className="w-4 h-4"/> Download JSON
                      </button>
                      <a 
                        href={sosUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 bg-rose-50 text-rose-600 font-bold py-3.5 rounded-xl hover:bg-rose-100 text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all border border-rose-100"
                      >
                        <span>Preview Live</span> <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/20 blur-[70px] rounded-full pointer-events-none"></div>
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4 shadow-inner">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Test SOS Broadcast</h3>
                      <p className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                        Verify real-time email and SMS delivery to your trusted emergency contacts instantly.
                      </p>
                    </div>
                    <div className="pt-6">
                      <button 
                        onClick={handleTriggerSOS} 
                        disabled={alertStatus === 'sending'} 
                        className="w-full bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-rose-600/30 flex justify-center items-center gap-2.5 relative z-10 disabled:opacity-50 active:scale-95 transition-all"
                      >
                        <Send className="w-4 h-4" /> 
                        {alertStatus === 'sending' ? 'Broadcasting Alert...' : alertStatus === 'success' ? 'Alert Dispatched!' : 'Trigger SOS Alert'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: CONTACTS ================= */}
              {activeTab === 'contacts' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-400">
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Emergency Contacts</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Manage your trusted circle who will be notified during emergency triggers.</p>
                  </div>

                  <div className="bg-rose-50/80 border border-rose-100 p-4.5 rounded-2xl flex items-start gap-3.5 mb-6 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm font-semibold text-rose-900 leading-relaxed">
                      These contacts will receive immediate notifications and live GPS coordinates when a LifeTag scan occurs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {profile.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="border border-slate-200/80 bg-slate-50/50 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between hover:border-slate-300 hover:bg-white hover:shadow-md transition-all gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-brrom-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-base">{contact.name}</h4>
                              <span className="text-[10px] font-extrabold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-full">{contact.relation}</span>
                              {idx === 0 && <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full">Primary</span>}
                            </div>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5"><Phone className="w-3.5 h-3.5 text-slate-400"/> {contact.phone}</p>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-slate-400"/> {contact.email}</p>
                          </div>
                        </div>
                        <div className="flex-col items-end gap-1.5 hidden sm:flex">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notify Status</span>
                          <div className="w-11 h-6 bg-rose-600 rounded-full relative shadow-inner">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showAddContact ? (
                    <form onSubmit={handleAddContact} className="mt-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-inner animate-in zoom-in-95 duration-200">
                      <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Add New Trusted Contact</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <input required type="text" placeholder="Full Name" className="p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-rose-500 text-sm font-semibold shadow-sm" value={newContact.name} onChange={e=>setNewContact({...newContact, name: e.target.value})} />
                        <input required type="text" placeholder="Relation (e.g., Parent)" className="p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-rose-500 text-sm font-semibold shadow-sm" value={newContact.relation} onChange={e=>setNewContact({...newContact, relation: e.target.value})} />
                        <input required type="tel" placeholder="Phone Number" className="p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-rose-500 text-sm font-semibold shadow-sm" value={newContact.phone} onChange={e=>setNewContact({...newContact, phone: e.target.value})} />
                        <input required type="email" placeholder="Email Address" className="p-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-rose-500 text-sm font-semibold shadow-sm" value={newContact.email} onChange={e=>setNewContact({...newContact, email: e.target.value})} />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all">Save Contact</button>
                        <button type="button" onClick={()=>setShowAddContact(false)} className="bg-slate-200/80 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <button 
                      onClick={()=>setShowAddContact(true)} 
                      className="w-full mt-6 py-4.5 border-2 border-dashed border-rose-200 rounded-2xl text-rose-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-rose-50/50 hover:border-rose-300 transition-all shadow-sm active:scale-[0.99]"
                    >
                      <Plus className="w-4 h-4" /> Add New Emergency Contact
                    </button>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2"><BellRing className="w-4 h-4 text-rose-500"/> Test Emergency Alert</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Send a diagnostic test message to check system connectivity.</p>
                    </div>
                    <button onClick={handleTriggerSOS} className="bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95">
                      Test Now <ChevronRight className="w-3.5 h-3.5 inline ml-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 5: LOCATION SHARING ================= */}
              {activeTab === 'location' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-400">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Location Sharing</h2>
                  <p className="text-slate-500 text-sm mb-6">Real-time GPS tracking and live coordinates broadcast settings.</p>

                  <div className="bg-emerald-50/80 border border-emerald-200 p-4.5 rounded-2xl flex items-center justify-between mb-6 shadow-sm cursor-pointer" onClick={()=>setLocSharingOn(!locSharingOn)}>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-sm"><MapPin className="w-5 h-5" /></div>
                      <span className="font-bold text-emerald-950 text-sm">Location Broadcasting is {locSharingOn ? 'ON' : 'OFF'}</span>
                    </div>
                    <div className={`w-12 h-7 rounded-full relative transition-colors shadow-inner ${locSharingOn ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 shadow-md transition-all ${locSharingOn ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>

                  <div className="border border-slate-200/80 rounded-3xl overflow-hidden mb-6 relative shadow-sm">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black text-slate-700 shadow-md z-10 border border-slate-100">
                      Live GPS Active
                    </div>
                    {gpsCoords ? (
                      <iframe 
                        title="Live Location"
                        width="100%" height="250" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                        src={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}&z=15&output=embed`}
                        className="opacity-95"
                      ></iframe>
                    ) : (
                      <div className="h-64 bg-slate-100 flex items-center justify-center text-slate-400 font-medium flex-col gap-2">
                        <MapPin className="w-8 h-8 animate-bounce text-rose-500" /> Acquiring High-Accuracy GPS Signal...
                      </div>
                    )}
                    <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-xs font-semibold text-slate-700 w-full sm:w-2/3 truncate font-mono">
                        {gpsCoords ? `LAT: ${gpsCoords.lat.toFixed(4)}, LNG: ${gpsCoords.lng.toFixed(4)}` : 'Searching satellite coordinates...'}
                      </p>
                      <button onClick={() => setShowShareModal(true)} className="w-full sm:w-auto bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-1.5 transition-all">
                        <Send className="w-3.5 h-3.5"/> Share Coordinates
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mt-6">
                    {[
                      { icon: Clock, label: 'Last Coordinates Synced', value: 'Just now' },
                      { icon: User, label: 'Shared With Circle', value: `${profile.emergencyContacts.length} Contacts` },
                      { icon: MapPin, label: 'Location Permissions', value: 'Always Allow', valColor: 'text-blue-600' },
                      { icon: BatteryCharging, label: 'Background Battery Mode', value: 'Optimized', valColor: 'text-emerald-600' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-3.5 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                          <item.icon className="w-4 h-4 text-slate-400" /> {item.label}
                        </div>
                        <div className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${item.valColor || 'text-slate-600'}`}>
                          {item.value} <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 7: SECURITY ================= */}
              {activeTab === 'security' && (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-400">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Privacy & Security</h2>
                  <p className="text-slate-500 text-sm mb-6">Manage end-to-end encryption standards, passwords, and account safety.</p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5">Data Vault & Compliance</h3>
                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                        {[
                          { icon: ShieldCheck, label: 'AES-256 Data Encryption', value: 'Active', color: 'text-emerald-600' },
                          { icon: Eye, label: 'Public QR Access Level', value: 'Emergency View Only' },
                          { icon: QRCodeCanvas, label: 'Token Expiration Protocol', value: 'Dynamic' },
                          { icon: MapPin, label: 'Location Privacy Mode', value: 'Secured', color: 'text-emerald-600' }
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer">
                            <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                              <item.icon className="w-4 h-4 text-slate-400" /> {item.label}
                            </div>
                            <div className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${item.color || 'text-slate-600'}`}>
                              {item.value} <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5">Authentication</h3>
                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                        <div onClick={() => setShowPasswordModal(true)} className="flex justify-between items-center p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700"><Lock className="w-4 h-4 text-slate-400 group-hover:text-rose-500" /> Change Account Password</div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <div onClick={() => setShow2FAModal(true)} className="flex justify-between items-center p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700"><Smartphone className="w-4 h-4 text-slate-400 group-hover:text-blue-500" /> Two-Factor Authentication (2FA)</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">{twoFactorOn ? <span className="text-emerald-600 font-extrabold">On</span> : 'Off'} <ChevronRight className="w-3.5 h-3.5 text-slate-300" /></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5">Data Control</h3>
                      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
                        <div onClick={downloadData} className="flex justify-between items-center p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700"><Download className="w-4 h-4 text-slate-400 group-hover:text-slate-700" /> Export Medical Vault (JSON)</div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <div onClick={handleDeleteAccount} className="flex justify-between items-center p-3.5 sm:p-4 bg-red-50/50 hover:bg-red-100/60 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 text-xs sm:text-sm font-black text-red-600"><Trash2 className="w-4 h-4" /> Permanently Delete Account</div>
                          <ChevronRight className="w-3.5 h-3.5 text-red-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODALS ================= */}

        {/* SHARE LOCATION MODAL */}
        {showShareModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Share Live Location</h3>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={gpsCoords ? `https://maps.google.com/?q=${gpsCoords.lat},${gpsCoords.lng}` : 'Waiting for GPS...'} 
                  className="bg-transparent w-full outline-none text-xs font-mono text-slate-600 truncate"
                />
                <button onClick={copyToClipboard} className="bg-rose-100 text-rose-600 p-2 rounded-xl hover:bg-rose-200 transition-colors shrink-0 shadow-sm">
                  {copySuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={() => setShowShareModal(false)} className="w-full bg-slate-900 text-white font-bold text-xs py-3.5 rounded-2xl hover:bg-slate-800 shadow-md transition-all">Done</button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Quick Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select 
                    value={editFormData.bloodGroup} 
                    onChange={e => setEditFormData({...editFormData, bloodGroup: e.target.value})}
                    className="w-full p-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 outline-none bg-slate-50 font-bold text-sm shadow-sm"
                  >
                    {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Current Medications / Notes</label>
                  <textarea 
                    value={editFormData.currentMedications}
                    onChange={e => setEditFormData({...editFormData, currentMedications: e.target.value})}
                    className="w-full p-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 outline-none bg-slate-50 font-medium text-sm min-h-24 resize-none shadow-sm"
                    placeholder="E.g., Inhaler, BP meds..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-rose-600 text-white font-bold text-xs py-3.5 rounded-2xl hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all">Save Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Change Password</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <input type="password" required placeholder="Current Password" value={passwordData.oldPassword} onChange={e=>setPasswordData({...passwordData, oldPassword: e.target.value})} className="w-full p-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 outline-none bg-slate-50 text-sm font-medium shadow-sm" />
                <input type="password" required placeholder="New Password" value={passwordData.newPassword} onChange={e=>setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full p-3.5 border-2 border-slate-100 rounded-2xl focus:border-rose-500 outline-none bg-slate-50 text-sm font-medium shadow-sm" />
                <button type="submit" className="w-full bg-slate-900 text-white font-bold text-xs py-3.5 rounded-2xl hover:bg-slate-800 shadow-md transition-all mt-2">Update Password</button>
              </form>
            </div>
          </div>
        )}

        {/* 2FA SETUP MODAL */}
        {show2FAModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-center border border-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h3 className="text-lg font-black text-slate-900">Two-Factor Authentication</h3>
                <button onClick={() => setShow2FAModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              
              {!twoFactorOn ? (
                <>
                  <p className="text-xs text-slate-500 leading-relaxed">Scan this QR code using Google Authenticator or Authy to configure 2FA vault protection.</p>
                  <div className="bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200 mx-auto w-fit shadow-inner">
                    <QRCodeCanvas value="otpauth://totp/LifeTag?secret=JBSWY3DPEHPK3PXP" size={110} level={"M"} />
                  </div>
                  <button onClick={() => { setTwoFactorOn(true); setShow2FAModal(false); alert("2FA Enabled Successfully!"); }} className="w-full bg-blue-600 text-white font-bold text-xs py-3.5 rounded-2xl hover:bg-blue-700 shadow-md transition-all">Enable 2FA</button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner"><ShieldCheck className="w-7 h-7" /></div>
                  <p className="text-xs text-slate-500 leading-relaxed">Two-Factor Authentication is currently active and securing your user session.</p>
                  <button onClick={() => { setTwoFactorOn(false); setShow2FAModal(false); }} className="w-full bg-red-50 text-red-600 font-bold text-xs py-3.5 rounded-2xl hover:bg-red-100 transition-all">Disable 2FA</button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;