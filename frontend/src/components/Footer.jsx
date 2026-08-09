import { HeartPulse, Globe, Share2, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 px-6 border-t border-slate-900 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rose-600/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-linear-to-br from-rose-500 to-rose-600 p-2 rounded-xl text-white shadow-lg shadow-rose-600/30">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">LifeTag</span>
          </div>
          <p className="text-sm font-medium leading-relaxed max-w-sm text-slate-400">
            Empowering people with instant access to critical medical information when it matters most.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[Globe, MessageCircle, Share2, Mail].map((Icon, idx) => (
              <button key={idx} className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300 shadow-sm active:scale-95">
                <Icon className="w-4 h-4"/>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6">Quick Links</h4>
          <ul className="space-y-3.5 text-sm font-medium text-slate-400">
            <li><a href="/" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">Home</a></li>
            <li><a href="/#how-it-works" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">How It Works</a></li>
            <li><a href="/#features" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">Features</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6">Support</h4>
          <ul className="space-y-3.5 text-sm font-medium text-slate-400">
            <li><a href="#" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">Help Center</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">Terms of Use</a></li>
            <li><a href="mailto:support@lifetag.app" className="hover:text-rose-400 transition-colors inline-block hover:translate-x-1 duration-200">support@lifetag.app</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-6">Stay Updated</h4>
          <p className="text-xs font-medium mb-4 text-slate-400 leading-relaxed">Subscribe for updates and emergency safety tips.</p>
          <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800 shadow-inner">
            <input type="email" placeholder="Enter your email" className="bg-transparent text-white px-3.5 py-2.5 outline-none w-full text-xs font-medium placeholder:text-slate-600" />
            <button className="bg-linear-to-r from-rose-600 to-rose-700 text-white px-5 py-2.5 rounded-xl font-bold hover:from-rose-700 hover:to-rose-800 transition-all text-xs shadow-md shadow-rose-600/20 active:scale-95 shrink-0">Join</button>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center text-xs font-medium text-slate-500 relative z-10">
        © {new Date().getFullYear()} LifeTag. All rights reserved. Built for rapid emergency response.
      </div>
    </footer>
  );
};

export default Footer;