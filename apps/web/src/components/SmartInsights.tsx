'use client'

import { useEffect, useState } from 'react'
import { Brain, Zap, Clock, TrendingUp, Sparkles, Loader2 } from 'lucide-react'

interface Insights {
  mostUnstable: string
  avgDurationMs: number
  recurringFailures: { name: string; count: number }[]
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const fetchInsights = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${baseUrl}/test-insights`)
      if (res.ok) setInsights(await res.json())
    } catch (err) {
      console.error('Error fetching insights:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateAiInsight = async (testName: string) => {
    setAnalyzing(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${baseUrl}/generate-ai-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testName, lastError: 'Potential data contamination' })
      })
      if (res.ok) {
        const data = await res.json()
        setAiSummary(data.summary)
      }
    } catch (err) {
      setAiSummary('Failed to generate AI analysis.')
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    fetchInsights()
    const interval = setInterval(fetchInsights, 20000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !insights) {
    return (
      <div className="glass p-6 rounded-2xl animate-pulse flex flex-col items-center justify-center gap-4 h-[250px]">
        <Brain className="w-8 h-8 text-slate-700" />
        <p className="text-slate-500 text-sm">Generating smart insights...</p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl border-t-4 border-t-purple-500/50">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Smart Test Insights
      </h3>

      <div className="space-y-6">
        {/* Most Unstable */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Most Unstable</p>
            <p className="text-sm font-medium text-slate-200">{insights.mostUnstable}</p>
            {insights.mostUnstable !== 'None detected' && (
              <button 
                onClick={() => generateAiInsight(insights.mostUnstable)}
                className="mt-2 text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                disabled={analyzing}
              >
                {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Analyze root cause with Sentinel AI
              </button>
            )}
          </div>
        </div>

        {/* AI Result Area */}
        {aiSummary && (
          <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl text-[11px] text-slate-300 leading-relaxed italic animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center gap-1.5 mb-1 text-purple-400 not-italic font-bold uppercase tracking-tighter">
              <Sparkles className="w-3 h-3" />
              AI Diagnosis
            </div>
            {aiSummary}
          </div>
        )}

        {/* Avg Duration */}
        {/* Avg Duration */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg. Duration</p>
            <p className="text-sm font-medium text-slate-200">{(insights.avgDurationMs / 1000).toFixed(2)}s</p>
          </div>
        </div>

        {/* Recurring Failures */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Zap className="w-4 h-4 text-rose-400" />
          </div>
          <div className="w-full">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Recurring Failures (24h)</p>
            {insights.recurringFailures.length > 0 ? (
              <div className="mt-2 space-y-1">
                {insights.recurringFailures.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-rose-500/5 p-1.5 rounded border border-rose-500/10">
                    <span className="text-[11px] text-rose-200 truncate max-w-[120px]">{f.name}</span>
                    <span className="text-[10px] font-bold text-rose-500">{f.count}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-600 mt-1">No critical recurring failures detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
