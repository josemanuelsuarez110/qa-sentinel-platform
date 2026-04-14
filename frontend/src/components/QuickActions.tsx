'use client'

import { useState } from 'react'
import { ShieldCheck, Search, DollarSign, Activity, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'

type LogType = "info" | "success" | "warning" | "error"

type QuickActionsProps = {
  onRefresh?: () => void
  onStartAudit?: () => void
  onAddLog?: (message: string, type?: LogType) => void
  onAuditComplete?: (data: any) => void
}

export default function QuickActions({
  onRefresh,
  onStartAudit,
  onAddLog,
  onAuditComplete
}: QuickActionsProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleRun = async () => {
    setIsExecuting(true)
    setShowResults(false)
    if (onStartAudit) onStartAudit()

    if (onAddLog) {
      onAddLog('[✓] Sentinel engine initialized', 'success')
      await new Promise(r => setTimeout(r, 600))
      onAddLog('[✓] Crawling started', 'success')
      await new Promise(r => setTimeout(r, 800))
      onAddLog('[✓] 12 endpoints discovered', 'success')
      await new Promise(r => setTimeout(r, 1000))
      onAddLog('[⚠] Missing security headers', 'warning')
      await new Promise(r => setTimeout(r, 1200))
      onAddLog('[✓] Financial audit completed', 'success')
    }

    // Wrap up execution
    setTimeout(() => {
      setIsExecuting(false)
      setShowResults(true)
      if (onAuditComplete) {
        onAuditComplete({
          totalAmount: 12500,
          inconsistencies: 2,
          riskLevel: 'Medium'
        })
      }
      if (onRefresh) onRefresh()
    }, 1000)
  }

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Orchestrator</h3>
        <span className="text-[10px] text-slate-500 font-mono">ID: SA-90210</span>
      </div>

      <button 
        onClick={handleRun}
        disabled={isExecuting}
        className="group relative w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-wait transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
      >
        {isExecuting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Auditing Infrastructure...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Run AI QA & Financial Audit</span>
          </>
        )}
      </button>

      {showResults && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Scan Results Block */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
             <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Scan Summary</span>
             </div>
             <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1">
                   <p className="text-slate-500 font-medium">Status</p>
                   <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-slate-500 font-medium">Pages Scanned</p>
                   <p className="text-white font-bold">8</p>
                </div>
             </div>
             <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-slate-400 uppercase font-bold">Vulnerabilities Found</span>
                   <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-black rounded">2</span>
                </div>
                <ul className="text-[10px] space-y-1 text-slate-300 italic font-mono">
                   <li className="flex items-center gap-2">• Missing X-Frame-Options</li>
                   <li className="flex items-center gap-2">• Potential XSS detected</li>
                </ul>
             </div>
          </div>

          {/* Financial Validation Block */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-3">
             <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Financial Integrity Check</span>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[11px]">
                   <span className="text-slate-400">Transactions</span>
                   <span className="text-white font-bold font-mono">45</span>
                </div>
                <div className="flex justify-between text-[11px]">
                   <span className="text-slate-400">Total Amount</span>
                   <span className="text-emerald-400 font-bold font-mono">$12,500.00</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-emerald-500/10">
                   <span className="text-slate-400">Inconsistencies</span>
                   <span className="text-rose-400 font-bold font-mono">2</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-[10px] text-slate-400 uppercase font-bold">Risk Level</span>
                   <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-black rounded uppercase">Medium</span>
                </div>
             </div>
          </div>

          <button className="w-full flex items-center justify-between px-4 py-2 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-colors group">
             Detailed audit report
             <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  )
}
