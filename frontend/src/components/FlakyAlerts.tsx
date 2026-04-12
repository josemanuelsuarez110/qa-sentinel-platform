'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

interface FlakyAlert {
  id: string
  test_name: string
  fail_count: number
  last_error: string | null
  updated_at: string
}

const FALLBACK_ALERTS: FlakyAlert[] = [
  {
    id: 'mock-1',
    test_name: 'tenant-isolation-test',
    fail_count: 3,
    last_error: 'Found inconsistent in 3/10 runs.',
    updated_at: new Date().toISOString()
  }
]

export default function FlakyAlerts() {
  const [alerts, setAlerts] = useState<FlakyAlert[]>(FALLBACK_ALERTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('flaky_history')
        .select('*')
        .order('fail_count', { ascending: false })
        .limit(5)

      if (!error && data && data.length > 0) {
        setAlerts(data)
      }
      setLoading(false)
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500/50">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        Flaky Test Alerts
        {loading && <RefreshCcw className="w-3 h-3 text-slate-500 animate-spin ml-auto" />}
      </h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-yellow-200">{alert.test_name}</p>
              <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                {alert.fail_count}x
              </span>
            </div>
            {alert.last_error && (
              <p className="text-xs text-slate-400 mt-1">{alert.last_error}</p>
            )}
            <p className="text-xs text-slate-600 mt-1">
              {new Date(alert.updated_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
