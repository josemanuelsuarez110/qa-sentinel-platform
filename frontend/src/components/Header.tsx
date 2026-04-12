import { Beaker, Shield, Layers } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-[#0a0a0b]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">QA<span className="text-blue-500">Sentinel</span></span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Test Suites</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Analytics</a>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Settings</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-800" />
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
              <Shield className="w-5 h-5" />
            </a>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
