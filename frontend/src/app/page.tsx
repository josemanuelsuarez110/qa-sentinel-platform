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
    totalRuns: 12, 
    passRate: 85, 
    failCount: 2, 
    avgDuration: "1.2s", 
    lastRunAt: new Date().toLocaleTimeString(),
    activeWorkers: 0, 
    flakyTests: 0 
  })
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

      if (statsRes.ok) setStats(await statsRes.json())
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
            QA Sentinel <span className="gradient-text">Platform</span>
          </h1>
          <p className="text-slate-400 text-xl leading-relaxed">
            Automate end-to-end testing workflows using Playwright, <br className="hidden md:block" />
            CI/CD pipelines, and real-time reporting dashboards.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-16 h-16 text-blue-400" />
            </div>
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-4">Step 1</h4>
            <h3 className="text-2xl font-bold mb-3">Trigger test execution</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Initiate comprehensive test suites manually or via webhook integration.</p>
          </div>

          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-emerald-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Step 2</h4>
            <h3 className="text-2xl font-bold mb-3">Run automated checks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">High-concurrency workers execute your Playwright scenarios in parallel.</p>
          </div>

          <div className="glass group p-8 rounded-3xl border-t border-white/5 hover:border-purple-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Clock className="w-16 h-16 text-purple-400" />
            </div>
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">Step 3</h4>
            <h3 className="text-2xl font-bold mb-3">Visualize results</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Access real-time trends, visual reports, and AI failure diagnostics.</p>
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
            <QuickActions onRefresh={fetchData} />
          </div>
        </div>
      </div>
    </main>
  )
}
