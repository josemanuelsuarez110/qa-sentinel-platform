export class RetryHandler {
  public maxRetries: number = 3
  public baseDelay: number = 1000

  async wait(retryCount: number): Promise<void> {
    const delay = Math.pow(2, retryCount - 1) * this.baseDelay
    console.log(`[RetryHandler] Waiting ${delay}ms before retry...`)
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}
