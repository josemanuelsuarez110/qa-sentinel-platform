'use client'

import Header from '@/components/Header'
import ProDashboard from '@/components/ProDashboard'
import { Zap, Activity, Clock } from 'lucide-react'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center md:text-left max-w-4xl">
          <h1 className="text-5xl font-extrabold font-display tracking-tight lg:text-7xl mb-6">
            Sentinel <span className="gradient-text">Integrated Auditor</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed max-w-3xl">
            "I built an AI-powered QA platform that executes automated scans, detects vulnerabilities, and validates financial data integrity. It simulates real-world testing pipelines with execution logs and analytics dashboards."
          </p>
        </section>

        {/* How It Works Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-emerald-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Step 1</h4>
            <h3 className="text-2xl font-bold mb-3">Trigger Financial Sandbox</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Initiate automated ledger and arithmetic validation suites for ERP systems.</p>
          </div>

          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-blue-400" />
            </div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Step 2</h4>
            <h3 className="text-2xl font-bold mb-3">Automate Integrity Checks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Verify transaction balancing, tax calculations, and currency conversions in real-time.</p>
          </div>

          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-rose-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16 text-rose-400" />
            </div>
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-[0.2em] mb-4">Step 3</h4>
            <h3 className="text-2xl font-bold mb-3">Assess Risks & Results</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Identify financial inconsistencies and exposure of sensitive payment data instantly.</p>
          </div>
        </section>

        {/* Pro Dashboard Integration */}
        <section className="pt-8">
           <div className="glass rounded-3xl border-t border-white/5 overflow-hidden shadow-2xl shadow-emerald-500/10">
              <ProDashboard />
           </div>
        </section>

      </div>
    </main>
  )
}
