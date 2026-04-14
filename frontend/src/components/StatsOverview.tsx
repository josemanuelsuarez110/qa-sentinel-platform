import { CheckCircle2, XCircle, Clock, Timer } from 'lucide-react'

export type Stats = {
  totalRuns: number
  passRate: number
  failCount: number
  avgDuration?: string
  lastRunAt?: string
}

interface StatsOverviewProps {
  stats: Stats
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const displayStats = [
    { label: 'Tests ejecutados', value: stats?.totalRuns?.toLocaleString() ?? '0', icon: Timer, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Resultados (Pass Rate)', value: `${stats?.passRate ?? 0}%`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Failed Tests', value: (stats?.failCount ?? 0).toString(), icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Última ejecución', value: stats?.lastRunAt ?? '--:--', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
