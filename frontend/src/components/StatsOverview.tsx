import { CheckCircle2, XCircle, Clock, Timer } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalRuns: number
    passRate: number
    failCount: number
    avgDuration?: string
  }
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const displayStats = [
    { label: 'Total Executions', value: stats.totalRuns.toLocaleString(), icon: Timer, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Pass Rate', value: `${stats.passRate}%`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Failed Tests', value: stats.failCount.toString(), icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Avg. Duration', value: stats.avgDuration || '3.5m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStats.map((stat) => (
        <div key={stat.label} className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className={`p-3 rounded-xl ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
