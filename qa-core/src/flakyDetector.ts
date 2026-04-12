import * as fs from 'fs'
import * as path from 'path'

export class FlakyDetector {
  private historyPath = path.resolve(__dirname, '../../reports/flaky-history.json')

  async recordInstability(testName: string, errorMessage?: string): Promise<void> {
    console.warn(`[FlakyDetector] Flagging test as unstable: ${testName}`)
    
    let history: Record<string, any> = {}
    if (fs.existsSync(this.historyPath)) {
      history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'))
    }

    if (!history[testName]) {
      history[testName] = {
        failCount: 0,
        instances: []
      }
    }

    history[testName].failCount++
    history[testName].instances.push({
      timestamp: new Date().toISOString(),
      error: errorMessage
    })

    if (!fs.existsSync(path.dirname(this.historyPath))) {
      fs.mkdirSync(path.dirname(this.historyPath), { recursive: true })
    }
    
    fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2))
  }
}
