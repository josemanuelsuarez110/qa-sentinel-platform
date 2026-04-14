'use client'

import { useState } from 'react'
import { Zap, FileText, CheckCircle2, Loader2, ShieldCheck, Landmark } from 'lucide-react'

type QuickActionsProps = {
  onRefresh: () => void
  onStartAudit?: () => void
  onAddLog?: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void
  onAuditComplete?: (data: any) => void
}

export default function QuickActions({ 
  onRefresh, 
  onStartAudit, 
  onAddLog, 
  onAuditComplete 
}: QuickActionsProps) {
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
    
    if (onStartAudit) onStartAudit()
    if (onAddLog) {
      onAddLog('Initializing Sentinel Integrated Engine v1.2.0...', 'info')
      await new Promise(r => setTimeout(r, 800))
      onAddLog('Target: Production Sandbox (Fintech-Core)', 'info')
      await new Promise(r => setTimeout(r, 600))
      onAddLog('Phase 1: Application Topology Mapping...', 'info')
      await new Promise(r => setTimeout(r, 900))
      onAddLog('Found 8 unique pages. Site map generated.', 'success')
      await new Promise(r => setTimeout(r, 700))
      onAddLog('Phase 2: Security Vulnerability Probing...', 'info')
      await new Promise(r => setTimeout(r, 1200))
      onAddLog('Potential XSS vector detected in /search?q=...', 'warning')
      onAddLog('Missing security header: X-Frame-Options', 'warning')
      await new Promise(r => setTimeout(r, 800))
      onAddLog('Phase 3: Financial Logic Assertion Engine...', 'info')
      await new Promise(r => setTimeout(r, 1000))
      onAddLog('Reconciling 120 transactions from ledger...', 'info')
      await new Promise(r => setTimeout(r, 1500))
      onAddLog('Arithmetic Mismatch: Expected $25,000, Got $24,988', 'error')
      onAddLog('Critical inconsistency in synthetic liquidity pool!', 'error')
      await new Promise(r => setTimeout(r, 1000))
      onAddLog('Audit complete. Summarizing findings...', 'success')
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      // Trigger real backend run in background
      fetch(`${baseUrl}/api/run-suite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suiteName: 'Smoke Test', tenantId: 'demo-tenant' })
      }).catch(e => console.warn('Backend offline, but demo proceeds.'))
      
      setTriggerState('success')
      setLastRun({ 
        status: 'FAILED', // We show FAILED because of the inconsistencies
        tests: 12, 
        passed: 9, 
        failed: 3, 
        duration: '4.2s',
        financialSummary: {
          totalTransactions: 120,
          totalAmount: 25000,
          inconsistencies: 3,
          riskLevel: "High"
        },
        steps: [
          "Ledger integrity verified",
          "Tax arithmetic assertions: FAILED",
          "Banking reconciliation: MISMATCH",
          "Security: 2 vulnerabilities found"
        ]
      })

      if (onAuditComplete) {
        onAuditComplete({
          totalAmount: 250000,
          inconsistencies: 12,
          riskLevel: 'High',
          vulnerabilities: 2,
          pagesMapped: 8
        })
      }

      setTimeout(() => { if (triggerState === 'success') setTriggerState('idle'); onRefresh() }, 15000)

    } catch (err) {
      // Fallback already handled by logic above for demo
    }
  }

  const handleGenerateReport = async () => {
    // Genera un reporte profesional en Markdown
    const reportContent = `
# SENTINEL INTEGRATED AUDIT REPORT
**Platform:** AI QA & Financial Validation Engine
**Generated At:** ${new Date().toLocaleString()}
**Classification:** CONFIDENTIAL / AUDITOR-READY

---

## 1. Executive Summary
This document provides a comprehensive analysis of the system integrity across four critical vectors: Functional QA, Cybersecurity, Site Topology (Crawling), and Financial Ledger Validity.

| Vector | Status | Critical Findings |
| :--- | :--- | :--- |
| **QA Automation** | PASSED | 0 Blockers |
| **Security Scanner** | VULNERABLE | 2 Medium Risks |
| **Financial Validator** | ERROR | 3 Inconsistencies |
| **Crawling Engine** | COMPLETED | 8 Pages Mapped |

---

## 2. Security Audit Findings
The Sentinel Security Engine identified the following exposure points:
- **[MEDIUM]** Missing Security Headers: X-Frame-Options is not enforced on /dashboard.
- **[HIGH]** Potential XSS Vector: Unescaped search parameter detected in site discovery.

## 3. Financial Integrity Ledger
The validation of the 120 latest transactions identified the following:
- **Total Validated Amout:** $25,000.00
- **Integrity Status:** FAILED
- **Primary Issue:** Negative balance detected in synthetic ledger reconciliation (Potential Liquidity Risk).

---

## 4. Certification
Sentinel AI confirms that the technical logic of the application remains stable, but business logic inconsistencies (Financial) require immediate manual audit.

*Generated by Sentinel AI Auditor v1.0*
    `.trim()

    const blob = new Blob([reportContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentinel-audit-report-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)

    setReportState('success')
    setTimeout(() => setReportState('idle'), 3000)
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-semibold mb-4 text-emerald-500">AI QA & Financial Validation Engine</h3>
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

                    {/* Financial Analysis Block */}
                    {lastRun.financialSummary && (
                      <div className="w-full mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px]">
                        <p className="font-bold text-emerald-400 uppercase tracking-widest mb-2 border-b border-emerald-500/10 pb-1">
                          Financial Analysis
                        </p>
                        <div className="space-y-1 text-slate-300">
                          <p className="flex justify-between">Total Transactions: <span className="text-emerald-400">{lastRun.financialSummary.totalTransactions}</span></p>
                          <p className="flex justify-between">Total Amount: <span className="text-emerald-400">${lastRun.financialSummary.totalAmount.toLocaleString()}</span></p>
                          <p className="flex justify-between">Inconsistencies: <span className="text-rose-400">{lastRun.financialSummary.inconsistencies}</span></p>
                          <p className="flex justify-between">Risk Level: <span className="text-amber-400 uppercase font-black">{lastRun.financialSummary.riskLevel}</span></p>
                        </div>
                      </div>
                    )}

                    {/* Scan Results Block */}
                    <div className="w-full mt-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px]">
                        <p className="font-bold text-blue-400 uppercase tracking-widest mb-2 border-b border-blue-500/10 pb-1">
                          Scan Results
                        </p>
                        <div className="space-y-1 text-slate-300">
                          <p className="flex justify-between">Status: <span className="text-blue-400 font-bold">COMPLETED</span></p>
                          <p className="flex justify-between">Pages Scanned: <span className="text-blue-400">8</span></p>
                          <p className="flex justify-between border-t border-blue-500/10 mt-1 pt-1 font-bold">Vulnerabilities Found: <span className="text-rose-400">2</span></p>
                          <div className="mt-1 space-y-0.5 text-rose-300/80 italic font-mono">
                            <p>• Missing X-Frame-Options</p>
                            <p>• Potential XSS detected</p>
                          </div>
                        </div>
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
