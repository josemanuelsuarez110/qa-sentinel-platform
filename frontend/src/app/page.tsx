'use client'

import { useEffect, useState, useCallback } from 'react'
import { Activity, Clock, Zap } from 'lucide-react'
import Header from '@/components/Header'
import StatsOverview from '@/components/StatsOverview'
import TestHistoryTable from '@/components/TestHistoryTable'
import HealthChart from '@/components/HealthChart'
import FlakyAlerts from '@/components/FlakyAlerts'
import SmartInsights from '@/components/SmartInsights'
import QuickActions from '@/components/QuickActions'

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    totalRuns: 120, 
    passRate: 85, 
    totalAmount: 250000, 
    inconsistencies: 18, 
    riskLevel: 'High',
    vulnerabilities: 0,
    pagesMapped: 0,
    lastRunAt: '--:--'
  })

  // Evitar Errores de Hidratación en Next.js
  useEffect(() => {
    setStats(prev => ({ 
      ...prev, 
      lastRunAt: new Date().toLocaleTimeString() 
    }))
  }, [])
  const [history, setHistory] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const [statsRes, historyRes, trendsRes] = await Promise.all([
        fetch(`${baseUrl}/api/health-stats`),
        fetch(`${baseUrl}/api/test-history`),
        fetch(`${baseUrl}/api/execution-trends`)
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(prev => ({
          ...prev,
          ...data,
          totalAmount: data.financial?.totalAmount ?? prev.totalAmount,
          inconsistencies: data.financial?.inconsistencies ?? prev.inconsistencies,
          riskLevel: data.financial?.riskLevel ?? prev.riskLevel,
          vulnerabilities: data.security?.issuesCount ?? prev.vulnerabilities,
          pagesMapped: data.crawler?.pagesMapped ?? prev.pagesMapped
        }))
      }
      if (trendsRes.ok) setTrends(await trendsRes.json())
      if (historyRes.ok) {
        const runsData = await historyRes.json()
        const flatResults = runsData.flatMap((run: any) =>
          (run.test_results || []).map((res: any) => ({
            ...res,
            suite_name: run.suite_name,
            tenant_id: run.tenant_id
          }))
        )
        setHistory(flatResults.slice(0, 10))
        if (flatResults.length > 0 && flatResults[0]?.created_at) {
          const lastDate = new Date(flatResults[0].created_at)
          if (!isNaN(lastDate.getTime())) {
            setStats(prev => ({ ...prev, lastRunAt: lastDate.toLocaleTimeString() }))
          }
        }
      }
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center md:text-left max-w-4xl">
          <h1 className="text-5xl font-extrabold font-display tracking-tight lg:text-7xl mb-6">
            Sentinel <span className="gradient-text">Finance QA</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Multi-Engine Quality & Integrity Auditor. <br className="hidden md:block" />
            QA automation, security scanning, crawling, and financial ledger validation in one unified dashboard.
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

        {/* Stats Grid */}
        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts & History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Execution Trends
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <HealthChart data={trends} />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Test History
              </h3>
              {loading ? (
                <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
                  Cargando actividad...
                </div>
              ) : (
                <TestHistoryTable history={history} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SmartInsights />
            <FlakyAlerts />
            <QuickActions 
              onRefresh={fetchData} 
              onAuditComplete={(data) => {
                setStats(prev => ({
                  ...prev,
                  totalAmount: data.totalAmount,
                  inconsistencies: data.inconsistencies,
                  riskLevel: data.riskLevel
                }))
              }}
            />
          </div>
        </div>

        {/* Use Cases Section */}
        <section className="glass p-8 rounded-3xl border-t border-white/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Use cases
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest text-emerald-500">Fintech Dashboard</h4>
              <p className="text-sm text-slate-400">Validate transaction integrity, tax calculations, and detect inconsistencies in banking endpoints.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest text-blue-500">ERP & SAP Migration</h4>
              <p className="text-sm text-slate-400">Perform large-scale data reconciliation tests for enterprise financial migrations.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase text-[10px] tracking-widest text-purple-500">Financial Security Audits</h4>
              <p className="text-sm text-slate-400">Automatically scan for unauthorized payment endpoints and PII exposure in reports.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
