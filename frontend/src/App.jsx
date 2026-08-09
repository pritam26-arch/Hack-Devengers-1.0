function App() {
  return (
    // Main Container (min-h-screen ensures it takes full height)
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans w-full">
      
      {/* --- NAVIGATION BAR --- */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner">
              HD
            </div>
            <span className="font-bold text-xl tracking-tight">Hack-Devengers</span>
          </div>

          {/* Desktop Menu (Hidden on mobile) */}
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Dashboard</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Team</a>
          </nav>

          {/* Action Button */}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            Get Started
          </button>

        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="grow flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-3xl">
          
          {/* Badge */}
          <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-6 border border-indigo-100">
            Status: Ready for Problem Statement 🚀
          </span>
          
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Let's Build Something <br/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
              Extraordinary
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Aapka React, Vite, aur Tailwind CSS setup poori tarah se ready hai. Ab bas problem statement aane ka wait hai. Best of luck team!
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Coding
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-3.5 rounded-xl font-semibold text-lg transition-all shadow-sm">
              View Components
            </button>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium">
          <p>© 2026 Hack-Devengers. Built for victory 🏆</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;