'use client'

import { useEffect, useState } from 'react'
import { Activity, Clock, AlertTriangle } from 'lucide-react'
import Header from '@/components/Header'
import StatsOverview from '@/components/StatsOverview'
import TestHistoryTable from '@/components/TestHistoryTable'
import HealthChart from '@/components/HealthChart'

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRuns: 0, passRate: 0, failCount: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const [statsRes, historyRes] = await Promise.all([
        fetch(`${baseUrl}/health-stats`),
        fetch(`${baseUrl}/test-history`)
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (historyRes.ok) {
        // We flatten the results from test_runs
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
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            QA System <span className="gradient-text">Health Overview</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time monitoring of SaaS automation suites across all tenants.
          </p>
        </section>

        {/* Stats Grid */}
        <StatsOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Charts Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Execution Trends
                </h3>
              </div>
              <div className="h-[300px] w-full">
                <HealthChart />
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Test History
              </h3>
              {loading ? (
                <div className="h-40 flex items-center justify-center text-slate-500">
                  Loading activity...
                </div>
              ) : (
                <TestHistoryTable history={history} />
              )}
            </div>
          </div>

          {/* Sidebar / Secondary Info */}
          <div className="space-y-8">
            <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Flaky Test Alerts
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                  <p className="text-sm font-medium text-yellow-200">tenant-isolation-test</p>
                  <p className="text-xs text-slate-400 mt-1">Found inconsistent in 3/10 runs.</p>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    const baseUrl = 'http://localhost:3001'
                    await fetch(`${baseUrl}/run-suite`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ suiteName: 'Smoke Test', tenantId: 'demo-tenant' })
                    })
                    fetchData()
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-medium text-sm"
                >
                  Trigger Smoke Suite
                </button>
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl font-medium text-sm">
                  Generate AI Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
