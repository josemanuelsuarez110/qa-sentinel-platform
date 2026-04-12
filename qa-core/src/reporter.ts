import { TestResult } from './testRunner'
import * as fs from 'fs'
import * as path from 'path'

export class Reporter {
  private reportDir = path.resolve(__dirname, '../../reports')

  async report(result: TestResult): Promise<void> {
    console.log(`[Reporter] Saving result for: ${result.name} - Status: ${result.status}`)

    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true })
    }

    const reportPath = path.join(this.reportDir, `report-${result.id}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2))

    // Also update a global summary
    const summaryPath = path.join(this.reportDir, 'summary.json')
    let summary: any[] = []
    
    if (fs.existsSync(summaryPath)) {
      summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
    }

    summary.push({
      id: result.id,
      name: result.name,
      status: result.status,
      duration: result.duration,
      timestamp: result.startTime
    })

    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  }
}
