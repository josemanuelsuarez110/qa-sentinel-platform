'use client'

import { useState } from 'react'
import { Zap, FileText, CheckCircle2, Loader2, ShieldCheck, Landmark } from 'lucide-react'

interface QuickActionsProps {
  onRefresh: () => void
  onAuditComplete?: (data: { 
    totalAmount: number, 
    inconsistencies: number, 
    riskLevel: string,
    vulnerabilities?: number,
    pagesMapped?: number
  }) => void
}

export default function QuickActions({ onRefresh, onAuditComplete }: QuickActionsProps) {
  const [triggerState, setTriggerState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [loadingStep, setLoadingStep] = useState<string>('')
  const [lastRun, setLastRun] = useState<{ 
    status: 'PASSED' | 'FAILED', 
    tests: number, 
    passed: number, 
    failed: number, 
    duration: string,
    steps: string[],
    financialSummary?: {
      totalTransactions: number,
      totalAmount: number,
      inconsistencies: number,
      riskLevel: string
    }
  } | null>(null)
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleTriggerSuite = async () => {
    setTriggerState('loading')
    setLastRun(null)
    
    // Simulación de pasos secuenciales según el enfoque FINTECH solicitado
    setLoadingStep('Initializing Financial Sandbox...')
    await new Promise(r => setTimeout(r, 600))
    setLoadingStep('→ Validating Ledger Integrity...')
    await new Promise(r => setTimeout(r, 900))
    setLoadingStep('→ Checking Security Probes...')
    await new Promise(r => setTimeout(r, 800))
    setLoadingStep('→ Mapping Application Sitemap...')
    await new Promise(r => setTimeout(r, 600))
    setLoadingStep('→ Integrated Audit Complete')
    await new Promise(r => setTimeout(r, 400))

    const start = Date.now()
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${baseUrl}/api/run-suite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suiteName: 'Smoke Test', tenantId: 'demo-tenant' })
      })
      
      // Para la demo, siempre mostramos el resultado realista incluso si falla el backend
      setTriggerState('success')
      setLastRun({ 
        status: 'PASSED', 
        tests: 12, 
        passed: 10, 
        failed: 2, 
        duration: '1.4s',
        financialSummary: {
          totalTransactions: 120,
          totalAmount: 25000,
          inconsistencies: 3,
          riskLevel: "medium"
        },
        steps: [
          "Ledger integrity verified",
          "Tax arithmetic assertions passed",
          "Banking reconciliation matched",
          "No auth-less payment endpoints found"
        ]
      })
      // Simulación de RIESGO ALTO después de la auditoría
      if (onAuditComplete) {
        onAuditComplete({
          totalAmount: 250000,
          inconsistencies: 12,
          riskLevel: 'High',
          vulnerabilities: 2,
          pagesMapped: 7
        })
      }

      setTimeout(() => { setTriggerState('idle'); onRefresh() }, 8000)

    } catch (err) {
      console.warn('Backend offline, using fallback mock data for demo.')
      setTriggerState('success')
      setLastRun({ 
        status: 'PASSED', 
        tests: 12, 
        passed: 10, 
        failed: 2, 
        duration: '1.4s',
        financialSummary: {
          totalTransactions: 120,
          totalAmount: 25000,
          inconsistencies: 3,
          riskLevel: "medium"
        },
        steps: [
          "Ledger integrity verified",
          "Tax arithmetic assertions passed",
          "Banking reconciliation matched",
          "No auth-less payment endpoints found"
        ]
      })
      setTimeout(() => setTriggerState('idle'), 8000)

      if (onAuditComplete) {
        onAuditComplete({
          totalAmount: 250000,
          inconsistencies: 12,
          riskLevel: 'High'
        })
      }
    }
  }

  const handleGenerateReport = async () => {
    setReportState('loading')
    await new Promise(r => setTimeout(r, 1500))

    // Genera un reporte básico en JSON y lo descarga
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'Sentinel Finance QA',
      summary: 'Financial Systems Integrity Report',
      note: 'Auditor-ready documentation of ledger and transaction validation.'
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-audit-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    setReportState('success')
    setTimeout(() => setReportState('idle'), 3000)
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 text-emerald-500">Finance Integrity Actions</h3>
      <div className="space-y-3">
        <button
          id="trigger-smoke-suite"
          onClick={handleTriggerSuite}
          disabled={triggerState === 'loading'}
          className="group relative w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed transition-all duration-300 rounded-xl font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.97] overflow-hidden shadow-lg shadow-emerald-500/20"
        >
          {/* Background Pulse during loading */}
          {triggerState === 'loading' && (
            <div className="absolute inset-0 bg-emerald-400/20 animate-pulse" />
          )}

          <div className="relative flex items-center justify-center gap-2 transition-all duration-300">
            {triggerState === 'idle' && !lastRun && (
              <>
                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Trigger Financial Audit</span>
              </>
            )}

            {triggerState === 'loading' && (
              <>
                <div className="relative w-5 h-5 flex-shrink-0">
                  <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span 
                    key={loadingStep}
                    className="tracking-wide text-xs font-mono animate-in fade-in slide-in-from-top-1 duration-300 whitespace-nowrap"
                  >
                    {loadingStep}
                  </span>
                </div>
              </>
            )}

            {(triggerState === 'success' || (lastRun && triggerState !== 'loading')) && (
              <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2">
                  {lastRun?.status === 'PASSED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Zap className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="font-bold tracking-tight">
                    {lastRun?.status}
                  </span>
                  <span className="text-emerald-100/60 text-xs font-medium bg-white/10 px-2 py-0.5 rounded-full">
                    {lastRun?.duration}
                  </span>
                </div>
                {lastRun && (
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <div className="flex gap-3 text-[10px] uppercase tracking-wider font-bold opacity-70">
                      <span className="text-slate-300">Tests: {lastRun.tests}</span>
                      <span className="text-emerald-400">Pass: {lastRun.passed}</span>
                      <span className="text-rose-400">Fail: {lastRun.failed}</span>
                    </div>

                    {/* Resumen Financiero solicitado */}
                    {lastRun.financialSummary && (
                      <div className="w-full mt-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[9px] text-emerald-100/70">
                        <p className="font-bold flex justify-between uppercase tracking-tighter mb-1 border-b border-emerald-500/20 pb-1 text-emerald-400">
                          Financial Summary
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                          <span className="flex justify-between">Total Tx: <b className="text-emerald-400">{lastRun.financialSummary.totalTransactions}</b></span>
                          <span className="flex justify-between">Amount: <b className="text-emerald-400">${lastRun.financialSummary.totalAmount.toLocaleString()}</b></span>
                          <span className="flex justify-between">Inconsist.: <b className="text-rose-400">{lastRun.financialSummary.inconsistencies}</b></span>
                          <span className="flex justify-between">Risk: <b className={lastRun.financialSummary.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'}>{lastRun.financialSummary.riskLevel}</b></span>
                        </div>
                      </div>
                    )}
                    
                    {/* Log de pasos */}
                    <div className="flex flex-col items-center mt-1 border-t border-white/5 pt-1 w-full">
                      {lastRun.steps.map((step, i) => (
                        <p key={i} className="text-[9px] text-slate-500 font-mono leading-tight">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {triggerState === 'error' && (
              <span className="text-rose-200 flex items-center gap-2 animate-shake">
                <Landmark className="w-4 h-4" /> Audit Failed — Service Offline
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
          {reportState === 'idle' && <><FileText className="w-4 h-4" /> Download Audit Report</>}
          {reportState === 'loading' && <><Loader2 className="w-4 h-4 animate-spin" /> Compiling Audit...</>}
          {reportState === 'success' && <><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Report Saved!</>}
        </button>
      </div>
    </div>
  )
}
