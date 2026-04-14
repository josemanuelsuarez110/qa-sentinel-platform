'use client'

import { useState, useEffect, useRef } from 'react'
import { Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export interface LogEntry {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: string
}

interface ExecutionLogsProps {
  logs: LogEntry[]
  isExecuting: boolean
}

export default function ExecutionLogs({ logs, isExecuting }: ExecutionLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="glass overflow-hidden rounded-2xl flex flex-col h-[400px]">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Execution Logs</span>
        </div>
        {isExecuting && (
          <div className="flex items-center gap-2 text-blue-400 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[10px] font-bold">ENGINE ACTIVE</span>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-white/10"
      >
        {logs.length === 0 && !isExecuting && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
            <Terminal className="w-8 h-8 opacity-20" />
            <p className="text-xs">No active execution. Trigger an audit to view logs.</p>
          </div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-600 flex-shrink-0">[{log.timestamp}]</span>
            <div className="flex gap-2 items-start">
              {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />}
              {log.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />}
              {log.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />}
              <span className={`
                ${log.type === 'success' ? 'text-emerald-400' : ''}
                ${log.type === 'warning' ? 'text-amber-400' : ''}
                ${log.type === 'error' ? 'text-rose-400' : ''}
                ${log.type === 'info' ? 'text-slate-300' : ''}
              `}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        {isExecuting && (
          <div className="flex gap-3 animate-pulse">
            <span className="text-slate-600">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className="text-blue-400">_</span>
          </div>
        )}
      </div>
      
      <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center whitespace-nowrap overflow-hidden">
        <div className="flex gap-4 text-[10px] text-slate-500">
          <span>CPU: 12%</span>
          <span>RAM: 256MB</span>
          <span>THREADS: 4</span>
        </div>
        <div className="text-[10px] text-emerald-500/50 font-bold">
          SENTINEL INTEGRATED ENGINE v1.2.0
        </div>
      </div>
    </div>
  )
}
