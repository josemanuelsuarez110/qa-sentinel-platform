'use client'

import { useEffect, useState, useCallback } from 'react'
import { Activity, Clock } from 'lucide-react'
import Header from '@/components/Header'
import StatsOverview from '@/components/StatsOverview'
import TestHistoryTable from '@/components/TestHistoryTable'
import HealthChart from '@/components/HealthChart'
import FlakyAlerts from '@/components/FlakyAlerts'
import SmartInsights from '@/components/SmartInsights'
import QuickActions from '@/components/QuickActions'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRuns: 0, passRate: 0, failCount: 0, avgDuration: '0m', activeWorkers: 0, flakyTests: 0 })
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
        <section>
          <h1 className="text-4xl font-bold font-display tracking-tight lg:text-5xl">
            QA Sentinel <span className="gradient-text">Platform</span>
          </h1>
          <p className="text-slate-400 mt-4 text-lg max-w-2xl">
            Enterprise-grade automated testing orchestration with real-time observability.
          </p>
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
