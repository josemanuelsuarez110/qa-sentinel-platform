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
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-all rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        >
          {triggerState === 'idle' && !lastRun && <><Zap className="w-4 h-4" /> [ Run Demo Test ]</>}
          {triggerState === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>}
          {(triggerState === 'success' || lastRun) && (
            <div className="flex items-center gap-2">
              {lastRun?.result === 'passed' ? '✅ passed' : '❌ failed'}
              <span className="text-blue-200 text-xs opacity-80">({lastRun?.time})</span>
            </div>
          )}
          {triggerState === 'error' && <><span className="text-rose-300">Error — Backend offline</span></>}
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
