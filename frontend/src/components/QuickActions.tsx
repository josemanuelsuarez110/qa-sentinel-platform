'use client'

import { useState } from 'react'
import { Zap, FileText, CheckCircle2, Loader2 } from 'lucide-react'

interface QuickActionsProps {
  onRefresh: () => void
}

export default function QuickActions({ onRefresh }: QuickActionsProps) {
  const [triggerState, setTriggerState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [lastRun, setLastRun] = useState<{ result: 'passed' | 'failed', time: string } | null>(null)
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleTriggerSuite = async () => {
    setTriggerState('loading')
    setLastRun(null)
    const start = Date.now()
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${baseUrl}/api/run-suite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suiteName: 'Smoke Test', tenantId: 'demo-tenant' })
      })
      
      if (res.ok) {
        const data = await res.json()
        // En una app real, pollearíamos el resultado. Aquí simulamos el feedback del suite.
        setTriggerState('success')
        const duration = ((Date.now() - start) / 1000).toFixed(1)
        setLastRun({ result: 'passed', time: `${duration}s` })
        setTimeout(() => { setTriggerState('idle'); onRefresh() }, 5000)
      } else {
        setTriggerState('error')
        setTimeout(() => setTriggerState('idle'), 3000)
      }
    } catch {
      setTriggerState('error')
      setTimeout(() => setTriggerState('idle'), 3000)
    }
  }

  const handleGenerateReport = async () => {
    setReportState('loading')
    await new Promise(r => setTimeout(r, 1500))

    // Genera un reporte básico en JSON y lo descarga
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'QA Sentinel',
      summary: 'Self-Healing QA Report',
      note: 'Conecta el backend en Render para generar reportes con datos reales.'
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qa-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    setReportState('success')
    setTimeout(() => setReportState('idle'), 3000)
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button
          id="trigger-smoke-suite"
          onClick={handleTriggerSuite}
          disabled={triggerState === 'loading'}
          className="group relative w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.97] overflow-hidden shadow-lg shadow-blue-500/20"
        >
          {/* Background Pulse during loading */}
          {triggerState === 'loading' && (
            <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
          )}

          <div className="relative flex items-center justify-center gap-2 transition-all duration-300">
            {triggerState === 'idle' && !lastRun && (
              <>
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Run Demo Test</span>
              </>
            )}

            {triggerState === 'loading' && (
              <>
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="tracking-wide">Executing Suite...</span>
              </>
            )}

            {(triggerState === 'success' || (lastRun && triggerState !== 'loading')) && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {lastRun?.result === 'passed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                ) : (
                  <Zap className="w-5 h-5 text-rose-300" />
                )}
                <span className="font-bold">
                  {lastRun?.result === 'passed' ? 'PASSED' : 'FAILED'}
                </span>
                <span className="text-blue-100/60 text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full">
                  {lastRun?.time}
                </span>
              </div>
            )}

            {triggerState === 'error' && (
              <span className="text-rose-200 flex items-center gap-2 animate-shake">
                <Zap className="w-4 h-4" /> Error — Backend Offline
              </span>
            )}
          </div>
        </button>

        <button
          id="generate-ai-report"
          onClick={handleGenerateReport}
          disabled={reportState === 'loading'}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 transition-all rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        >
          {reportState === 'idle' && <><FileText className="w-4 h-4" /> Generate AI Report</>}
          {reportState === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>}
          {reportState === 'success' && <><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Report Downloaded!</>}
        </button>
      </div>
    </div>
  )
}
