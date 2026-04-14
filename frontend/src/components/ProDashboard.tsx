"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type LogType = "info" | "success" | "warning" | "error"

type Log = {
  message: string
  type: LogType
}

export default function ProDashboard() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)

  const [results, setResults] = useState<any>(null)

  const runAudit = async () => {
    setLoading(true)
    setLogs([])
    setResults(null)

    const addLog = (message: string, type: LogType = "info") => {
      const now = new Date().toLocaleTimeString()
      setLogs(prev => [...prev, { message: `[${now}] ${message}`, type }])
    }

    addLog("Initializing Sentinel Engine...", "info")

    await new Promise(r => setTimeout(r, 800))
    addLog("Crawling started...", "info")

    await new Promise(r => setTimeout(r, 1000))
    addLog("12 endpoints discovered", "success")

    await new Promise(r => setTimeout(r, 1000))
    addLog("Missing security headers detected", "warning")

    await new Promise(r => setTimeout(r, 1000))
    addLog("Financial validation running...", "info")

    await new Promise(r => setTimeout(r, 1000))
    addLog("2 inconsistencies found", "error")

    setResults({
      vulnerabilities: [
        "Missing X-Frame-Options",
        "Potential XSS detected"
      ],
      financial: {
        transactions: 45,
        amount: 12500,
        inconsistencies: 2,
        risk: "Medium"
      }
    })

    setLoading(false)
  }

  const chartData = [
    { name: "Mon", scans: 2 },
    { name: "Tue", scans: 5 },
    { name: "Wed", scans: 3 },
    { name: "Thu", scans: 6 },
    { name: "Fri", scans: 4 }
  ]

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          AI QA & Financial Validation Dashboard
        </h1>

        <div className="flex gap-4 items-center">
          <input
            placeholder="Enter URL to scan..."
            className="border border-gray-700 bg-gray-900 p-2 rounded-xl text-white outline-none focus:border-blue-500 transition-colors w-64"
          />
          <button
            onClick={runAudit}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500 transition-colors"
          >
            {loading ? "Running..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-900 rounded-xl">
          <p>Total Scans</p>
          <h2 className="text-xl font-bold">24</h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-xl">
          <p>Vulnerabilities</p>
          <h2 className="text-xl font-bold">6</h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-xl">
          <p>Global Evaluation</p>
          <h2 className="text-xl font-bold text-yellow-400">Risk Score: 7.2 / 10</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-gray-900 p-4 rounded-xl h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="scans" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* EXECUTION LOGS */}
      <div className="bg-black p-4 rounded-xl h-48 overflow-y-auto">
        <h2 className="font-bold mb-2">Execution Logs</h2>

        {logs.map((log, i) => (
          <p key={i} className={`text-sm ${
            log.type === "error"
              ? "text-red-400"
              : log.type === "warning"
              ? "text-yellow-400"
              : log.type === "success"
              ? "text-green-400"
              : "text-gray-300"
          }`}>
            [{log.type.toUpperCase()}] {log.message}
          </p>
        ))}
      </div>

      {/* RESULTS */}
      {results && (
        <div className="grid grid-cols-2 gap-4">

          {/* SCAN RESULTS */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="font-bold mb-2">Scan Results</h2>

            <ul>
              {results.vulnerabilities.map((v: string, i: number) => (
                <li key={i} className="text-red-400">
                  - {v}
                </li>
              ))}
            </ul>
          </div>

          {/* FINANCIAL */}
          <div className="bg-gray-900 p-4 rounded-xl">
            <h2 className="font-bold mb-2">
              Financial Integrity
            </h2>

            <p>Transactions: {results.financial.transactions}</p>
            <p>Total: ${results.financial.amount}</p>
            <p className="text-red-400">
              Inconsistencies: {results.financial.inconsistencies}
            </p>
            <p>Risk: {results.financial.risk}</p>
          </div>
        </div>
      )}
    </div>
  )
}
