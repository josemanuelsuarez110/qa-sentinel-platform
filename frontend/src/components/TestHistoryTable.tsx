import { CheckCircle2, XCircle, RefreshCcw, Image, Film, FileText } from 'lucide-react'

interface TestHistoryItem {
  id: string
  test_name: string
  tenant_id?: string
  status: string
  created_at: string
  screenshot_url?: string
  video_url?: string
}

interface TestHistoryTableProps {
  history: TestHistoryItem[]
}

export default function TestHistoryTable({ history }: TestHistoryTableProps) {
  if (!history || history.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm italic">
        No recent test execution history found.
      </div>
    )
  }

  const getMediaUrl = (path?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    if (!path) return null
    return `${baseUrl}/api/evidence/${path}`
  }

  const getReportUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    return `${baseUrl}/api/reports/index.html`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Test Case</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Tenant</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase text-center">Execution Evidence</th>
            <th className="py-4 px-2 text-xs font-semibold text-slate-500 uppercase text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {history.map((row) => (
            <tr key={row.id} className="group hover:bg-slate-800/20 transition-colors">
              <td className="py-4 px-2 text-sm font-medium">{row.test_name}</td>
              <td className="py-4 px-2 text-sm text-slate-400 font-mono text-xs">{row.tenant_id || 'Global'}</td>
              <td className="py-4 px-2">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-4 px-2">
                <div className="flex items-center justify-center gap-3">
                  <a 
                    href={getReportUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-emerald-400"
                    title="View HTML Report"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                  {row.screenshot_url && (
                    <a 
                      href={getMediaUrl(row.screenshot_url)!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-blue-400"
                      title="View Screenshot"
                    >
                      <Image className="w-4 h-4" />
                    </a>
                  )}
                  {row.video_url && (
                    <a 
                      href={getMediaUrl(row.video_url)!} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-purple-400"
                      title="Watch Video"
                    >
                      <Film className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </td>
              <td className="py-4 px-2 text-xs text-slate-500 text-right">
                {new Date(row.created_at).toLocaleTimeString()}
              </td>
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
