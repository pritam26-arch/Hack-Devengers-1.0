import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Heart, User, QrCode, 
  ScanLine, Bell, FileText, MapPin, Lock, Users, 
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100/50 to-rose-50/20 font-sans text-slate-900 selection:bg-rose-500 selection:text-white overflow-hidden">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-rose-50 border border-rose-200/80 px-4 py-2 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-widest text-rose-700">Next-Gen Emergency Lifeline</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 tracking-tight">
            One QR Code.<br/>
            <span className="bg-linear-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent">All Critical Info.</span><br/>
            In An Emergency.
          </h1>
          <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-medium">
            LifeTag stores your vital medical information and shares it instantly when it matters most. Scan. View. Save Lives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/create" 
              className="bg-linear-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2.5 shadow-xl shadow-rose-600/25 hover:shadow-2xl hover:shadow-rose-600/35 hover:-translate-y-1 active:scale-95 transition-all group"
            >
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Create Your Profile
            </Link>
            <button className="bg-white text-slate-700 border-2 border-slate-200/80 px-8 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2.5 hover:border-slate-300 hover:bg-slate-50/80 shadow-sm hover:shadow active:scale-95 transition-all">
              <QrCode className="w-5 h-5 text-rose-600" />
              View Sample Profile
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-slate-200/80 text-xs sm:text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Secure & Private</div>
            <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500"/> Instant Access</div>
            <div className="flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500"/> Trusted by Families</div>
          </div>
        </div>

      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="py-24 bg-white/80 backdrop-blur-md relative border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-rose-600 font-black tracking-widest uppercase text-xs mb-3">Seamless Workflow</p>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-16 tracking-tight">Simple Steps. Powerful Impact.</h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Desktop Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-200/80 -z-10"></div>
            
            {[
              { icon: User, title: "Create Your Profile", desc: "Add medical information, emergency contacts, and vitals in minutes." },
              { icon: QrCode, title: "Get Your QR Code", desc: "We generate a unique QR code linked securely to your medical profile." },
              { icon: ScanLine, title: "Scan in Emergency", desc: "Anyone can scan the code to instantly access your critical information." },
              { icon: Bell, title: "Help Arrives Faster", desc: "Responders get the info they need. Contacts receive GPS alerts." }
            ].map((step, idx) => (
              <div key={idx} className="relative group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-slate-50 to-rose-50/50 border-2 border-white shadow-md rounded-2xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-md">
                    0{idx + 1}
                  </div>
                  <step.icon className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="py-24 bg-linear-to-b from-transparent to-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-rose-600 font-black tracking-widest uppercase text-xs mb-3">Core Capabilities</p>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-16 tracking-tight">Built For Emergencies.<br/>Designed For Life.</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Complete Medical Profile", desc: "Store vitals, allergies, conditions, medications, and more securely." },
              { icon: MapPin, title: "Instant Location Sharing", desc: "Share your live location with emergency contacts the moment you are scanned." },
              { icon: Lock, title: "Secure & Private", desc: "Your data is encrypted and accessible only when needed during emergencies." },
              { icon: Users, title: "Emergency Contacts", desc: "Add trusted contacts who are notified automatically via email alerts." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-4xl border border-slate-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 text-left group">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:shadow-lg group-hover:shadow-rose-600/30 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-rose-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2.5 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto bg-linear-to-r from-rose-600 via-rose-600 to-rose-700 rounded-[3rem] p-10 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl shadow-rose-600/30 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">Be Prepared Today.<br/>Stay Protected Always.</h2>
            <p className="text-rose-100 text-base font-medium max-w-lg">
              Create your LifeTag profile now and give your loved ones absolute peace of mind.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
            <Link to="/create" className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2.5 shadow-xl hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all text-sm">
              <User className="w-5 h-5" /> Create Your Profile
            </Link>
            <button className="text-white font-extrabold flex items-center justify-center gap-2 hover:text-rose-100 transition-colors text-sm px-4 py-2">
              Learn More <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;