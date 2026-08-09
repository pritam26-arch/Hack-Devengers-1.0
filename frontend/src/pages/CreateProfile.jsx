import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, Plus, X, Activity, Droplet, 
  User, Calendar, Phone, Mail, ChevronRight, Edit2, AlertCircle, HeartPulse, ShieldCheck
} from 'lucide-react';

// Modern Vertical Step Indicator for Web (Left Panel)
const WebStepIndicator = ({ currentStep }) => {
  const steps = [
    { num: 1, title: "Personal Info", desc: "Basic details" },
    { num: 2, title: "Blood & Allergies", desc: "Critical vitals" },
    { num: 3, title: "Medical History", desc: "Conditions & meds" },
    { num: 4, title: "Emergency Contacts", desc: "Who to notify" },
    { num: 5, title: "Review & Save", desc: "Generate LifeTag" }
  ];

  return (
    <div className="space-y-6 mt-12 relative">
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-linear-to-brom-rose-500/50 via-slate-800 to-slate-800 -z-10"></div>
      {steps.map((s) => {
        const isActive = currentStep === s.num;
        const isPast = currentStep > s.num;
        return (
          <div key={s.num} className="flex items-start gap-5 group transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-base transition-all duration-500 shadow-xl
              ${isActive ? 'bg-linear-to-br from-rose-500 to-rose-600 text-white scale-110 shadow-rose-500/30 ring-4 ring-rose-500/20' : 
                isPast ? 'bg-slate-800 text-rose-400 border border-rose-500/30' : 'bg-slate-900/80 text-slate-500 border border-slate-800/80'}`}
            >
              {isPast ? <ShieldCheck className="w-5 h-5 text-rose-400 animate-in zoom-in" /> : s.num}
            </div>
            <div className="mt-1">
              <h3 className={`text-base font-bold transition-colors duration-300 ${isActive ? 'text-white tracking-wide' : isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                {s.title}
              </h3>
              <p className={`text-xs transition-colors duration-300 font-medium ${isActive ? 'text-rose-300/90' : 'text-slate-600'}`}>
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Mobile Horizontal Step Indicator
const MobileStepIndicator = ({ currentStep }) => (
  <div className="flex lg:hidden items-center justify-between mb-8 relative px-2">
    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-10"></div>
    {[1, 2, 3, 4, 5].map((num) => (
      <div 
        key={num} 
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 shadow-sm
          ${currentStep === num ? 'bg-rose-600 text-white scale-110 ring-4 ring-rose-100 shadow-rose-500/30' : 
            currentStep > num ? 'bg-slate-900 text-rose-400' : 'bg-white text-slate-400 border border-slate-200'}`}
      >
        {num}
      </div>
    ))}
  </div>
);

const CreateProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real Schema Data State
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'A+ Positive',
    allergies: [],
    medicalConditions: [],
    currentMedications: '',
    emergencyContacts: [{ name: '', relation: '', phone: '', email: '' }]
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTag = (e, field, inputState, setInputState) => {
    e.preventDefault();
    if (inputState.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], inputState.trim()] });
      setInputState('');
    }
  };

  const handleRemoveTag = (field, indexToRemove) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, index) => index !== indexToRemove) });
  };

  const handleContactChange = (index, e) => {
    const updated = formData.emergencyContacts.map((contact, i) => (i === index ? { ...contact, [e.target.name]: e.target.value } : contact));
    setFormData({ ...formData, emergencyContacts: updated });
  };

  const addContact = () => setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { name: '', relation: '', phone: '', email: '' }] });
  const removeContact = (index) => {
    if (formData.emergencyContacts.length > 1) {
      setFormData({ ...formData, emergencyContacts: formData.emergencyContacts.filter((_, i) => i !== index) });
    }
  };

  // Final Submit with User Email attached
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const savedUser = JSON.parse(localStorage.getItem('lifetag_user')) || { email: 'anonymous@lifetag.com' };
    const payload = {
      ...formData,
      userEmail: savedUser.email
    };

    try {
      const res = await axios.post('http://localhost:8000/api/profiles', payload);
      if (res.data.success) {
        navigate(`/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100/50 to-rose-50/20 flex flex-col lg:flex-row font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      
      {/* LEFT PANEL - Premium Brand Area */}
      <div className="hidden lg:flex w-96 xl:w-105 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden shadow-2xl z-10 border-r border-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-linear-to-br from-rose-500 to-rose-600 p-2.5 rounded-2xl shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">LifeTag</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight mb-3">
            Create Your<br/><span className="text-rose-500">Medical Lifeline</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
            Securely structure your vital health parameters for lightning-fast emergency response.
          </p>
          
          <WebStepIndicator currentStep={step} />
        </div>

        <div className="relative z-10 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Enterprise-grade 256-bit encrypted secure medical vault.</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Spacious Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 min-h-screen">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-6 sm:p-10 md:p-12 relative overflow-hidden transition-all duration-500">
          
          {/* Top subtle glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-linear-to-r from-transparent via-rose-500 to-transparent opacity-60"></div>

          <div className="flex items-center gap-4 mb-8 lg:mb-10">
            <button 
              onClick={step > 1 ? handleBack : () => navigate(-1)} 
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all duration-300 border border-slate-200/80 group hover:shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <p className="text-rose-600 font-extrabold uppercase tracking-widest text-[11px] lg:hidden">Step {step} of 5</p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {step === 1 && "Personal Information"}
                {step === 2 && "Blood Group & Allergies"}
                {step === 3 && "Medical Conditions"}
                {step === 4 && "Emergency Contacts"}
                {step === 5 && "Review & Finish"}
              </h2>
            </div>
          </div>

          <MobileStepIndicator currentStep={step} />

          <div className="animate-in fade-in zoom-in-95 duration-400">
            
            {error && (
              <div className="mb-6 bg-rose-50 text-rose-700 p-4 rounded-2xl text-sm flex items-center gap-3 border border-rose-100 font-semibold shadow-sm animate-in shake duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" /> {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Full Legal Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange} 
                      placeholder="e.g., Aarav Sharma" 
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all duration-300 bg-slate-50/80 text-base font-semibold text-slate-800 shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Date of Birth</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                      type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all duration-300 bg-slate-50/80 font-semibold text-slate-800 shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Gender</label>
                  <div className="relative">
                    <select 
                      name="gender" value={formData.gender} onChange={handleChange} 
                      className="w-full px-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all duration-300 bg-slate-50/80 font-semibold text-slate-800 appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">▼</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Blood Group</label>
                  <div className="relative group">
                    <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500 drop-shadow" />
                    <select 
                      name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} 
                      className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all duration-300 bg-slate-50/80 appearance-none font-black text-rose-900 text-base shadow-sm cursor-pointer"
                    >
                      {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">▼</div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Severe Allergies</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-10 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                    {formData.allergies.length === 0 && (
                      <span className="text-slate-400 text-xs italic px-2 py-1">No allergies added yet. Type below to add.</span>
                    )}
                    {formData.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center gap-2 bg-rose-50 border border-rose-200/80 text-rose-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm animate-in zoom-in-95 duration-200">
                        {allergy}
                        <button onClick={(e) => { e.preventDefault(); handleRemoveTag('allergies', index); }} className="text-rose-400 hover:text-rose-700 bg-white/80 p-0.5 rounded-md transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e, 'allergies', allergyInput, setAllergyInput)}
                      placeholder="e.g., Penicillin, Peanuts (Press Enter)..." 
                      className="flex-1 px-5 py-4 border-2 border-slate-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none bg-slate-50/80 shadow-sm transition-all text-sm font-semibold text-slate-800" 
                    />
                    <button onClick={(e) => handleAddTag(e, 'allergies', allergyInput, setAllergyInput)} className="bg-slate-900 text-white px-6 rounded-2xl hover:bg-rose-600 transition-all font-bold shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-rose-600/20 active:scale-95 text-sm">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Medical Conditions</label>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-10 p-2 bg-slate-50/50 rounded-2xl border border-slate-100">
                    {formData.medicalConditions.length === 0 && (
                      <span className="text-slate-400 text-xs italic px-2 py-1">No conditions added yet. Type below to add.</span>
                    )}
                    {formData.medicalConditions.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-200/80 text-blue-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm animate-in zoom-in-95 duration-200">
                        {condition}
                        <button onClick={(e) => { e.preventDefault(); handleRemoveTag('medicalConditions', index); }} className="text-blue-400 hover:text-blue-700 bg-white/80 p-0.5 rounded-md transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" value={conditionInput} onChange={(e) => setConditionInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e, 'medicalConditions', conditionInput, setConditionInput)}
                      placeholder="e.g., Asthma, Hypertension (Press Enter)..." 
                      className="flex-1 px-5 py-4 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50/80 shadow-sm transition-all text-sm font-semibold text-slate-800" 
                    />
                    <button onClick={(e) => handleAddTag(e, 'medicalConditions', conditionInput, setConditionInput)} className="bg-slate-900 text-white px-6 rounded-2xl hover:bg-blue-600 transition-all font-bold shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 text-sm">
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 ml-1">Current Medications & Notes</label>
                  <textarea 
                    name="currentMedications" value={formData.currentMedications} onChange={handleChange} 
                    placeholder="Separate multiple medications with commas (e.g., Amlodipine 5mg, Inhaler as needed)..." 
                    className="w-full p-5 border-2 border-slate-100 rounded-2xl focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10 outline-none bg-slate-50/80 shadow-sm transition-all min-h-30 resize-none text-sm font-semibold text-slate-800"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6">
                {formData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-linear-to-br from-slate-50/80 to-slate-100/50 border-2 border-slate-100 p-6 rounded-3xl relative group hover:border-rose-200/80 transition-all duration-300 shadow-sm">
                    {formData.emergencyContacts.length > 1 && (
                      <button onClick={() => removeContact(index)} className="absolute top-5 right-5 text-slate-400 hover:text-rose-600 bg-white p-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 border border-slate-100">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <h3 className="font-extrabold text-slate-800 mb-5 flex items-center gap-2.5 text-sm uppercase tracking-wide">
                      <div className="bg-rose-100 text-rose-600 p-2 rounded-xl shadow-inner"><Phone className="w-4 h-4" /></div>
                      Emergency Contact #{index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" name="name" value={contact.name} onChange={(e) => handleContactChange(index, e)} 
                        placeholder="Full Name" 
                        className="w-full px-4 py-3.5 border-2 border-white rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-rose-400 focus:bg-white shadow-sm transition-all" 
                      />
                      <input 
                        type="text" name="relation" value={contact.relation} onChange={(e) => handleContactChange(index, e)} 
                        placeholder="Relation (e.g., Father, Spouse)" 
                        className="w-full px-4 py-3.5 border-2 border-white rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-rose-400 focus:bg-white shadow-sm transition-all" 
                      />
                      <input 
                        type="text" name="phone" value={contact.phone} onChange={(e) => handleContactChange(index, e)} 
                        placeholder="Phone Number (+91...)" 
                        className="w-full px-4 py-3.5 border-2 border-white rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-rose-400 focus:bg-white shadow-sm transition-all" 
                      />
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" name="email" value={contact.email} onChange={(e) => handleContactChange(index, e)} 
                          placeholder="Email Address for SOS Alerts" 
                          className="w-full pl-10 pr-4 py-3.5 border-2 border-white rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-rose-400 focus:bg-white shadow-sm transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addContact} 
                  className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50/50 hover:border-rose-300 hover:text-rose-700 transition-all shadow-sm active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4" /> Add Another Contact
                </button>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Personal Info", val: formData.fullName || 'Not provided', icon: User, s: 1 },
                  { title: "Blood Group", val: formData.bloodGroup, icon: Droplet, s: 2 },
                  { title: "Allergies", val: formData.allergies.length ? formData.allergies.join(', ') : 'None', icon: AlertCircle, s: 2 },
                  { title: "Conditions", val: formData.medicalConditions.length ? formData.medicalConditions.join(', ') : 'None', icon: Activity, s: 3 },
                  { title: "Primary Contact", val: formData.emergencyContacts[0].name || 'Not provided', icon: Phone, s: 4 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50/80 border-2 border-slate-100 p-5 rounded-2xl flex items-start justify-between group hover:border-rose-300/80 hover:bg-white transition-all duration-300 shadow-sm">
                    <div className="overflow-hidden pr-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <item.icon className="w-3.5 h-3.5 text-rose-500" /> {item.title}
                      </p>
                      <p className="font-bold text-slate-800 text-base truncate">{item.val}</p>
                    </div>
                    <button 
                      onClick={() => setStep(item.s)} 
                      className="text-slate-400 hover:text-rose-600 bg-white p-2 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 shrink-0 group-hover:scale-105"
                      title="Edit section"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
          </div>

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex gap-4">
            {step < 5 ? (
              <button 
                onClick={handleNext} 
                className="w-full bg-slate-900 text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-600 hover:shadow-xl hover:shadow-rose-600/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-linear-to-r from-rose-600 to-rose-700 text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2.5 hover:from-rose-700 hover:to-rose-800 hover:shadow-xl hover:shadow-rose-600/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Activity className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                {loading ? 'Securing Profile Vault...' : 'Create Medical Profile'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateProfile;