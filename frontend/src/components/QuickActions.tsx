'use client'

import { ShieldCheck } from 'lucide-react'

type QuickActionsProps = {
  onRefresh?: () => void
  onStartAudit?: () => void
  onAddLog?: (message: string, type?: string) => void
  onAuditComplete?: (data: any) => void
}

export default function QuickActions({
  onRefresh,
  onStartAudit,
  onAddLog,
  onAuditComplete
}: QuickActionsProps) {

  const handleRun = async () => {
    if (onStartAudit) onStartAudit()

    if (onAddLog) {
      onAddLog('Initializing Sentinel...', 'info')
    }
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 text-emerald-500">Sentinel Control</h3>
      <button 
        onClick={handleRun}
        className="group relative w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.97] shadow-lg shadow-emerald-500/20"
      >
        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Run Audit</span>
      </button>
    </div>
  )
}
