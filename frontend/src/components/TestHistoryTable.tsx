import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react'

const history = [
  { id: '829', name: 'Auth Isolation check', tenant: 'Tenant-A', status: 'passed', time: '2m ago' },
  { id: '828', name: 'Subscription Webhook', tenant: 'Tenant-B', status: 'failed', time: '15m ago' },
  { id: '827', name: 'Login Smoke', tenant: 'Any', status: 'passed', time: '1h ago' },
  { id: '826', name: 'Data Leak Analysis', tenant: 'Tenant-C', status: 'flaky', time: '3h ago' },
]

export default function TestHistoryTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Test Case</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Tenant</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {history.map((row) => (
            <tr key={row.id} className="group hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-2 text-sm font-medium">{row.name}</td>
              <td className="py-4 px-2 text-sm text-slate-400 font-mono text-xs">{row.tenant}</td>
              <td className="py-4 px-2">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4 px-2 text-xs text-slate-500 text-right">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'passed') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
      <CheckCircle2 className="w-3 h-3" /> Passed
    </span>
  )
  if (status === 'failed') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400">
      <XCircle className="w-3 h-3" /> Failed
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
      <RefreshCcw className="w-3 h-3" /> Flaky
    </span>
  )
}
