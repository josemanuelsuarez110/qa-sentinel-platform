import { Beaker, Shield, Layers, ShieldCheck, Landmark } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-[#0a0a0b]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight">Sentinel<span className="text-emerald-500">Validation</span></span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">AI QA & Financial Engine</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Risk Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Integrity Tasks</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Financial Reports</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Audits</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-800" />
            <a href="#" className="text-slate-400 hover:text-white">
              <Landmark className="w-5 h-5" />
            </a>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600" />
          </div>
        </div>
      </div>
    </header>
  )
}
