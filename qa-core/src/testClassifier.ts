export type TestTag = 'smoke' | 'regression' | 'critical' | 'isolation' | 'auth'

export class TestClassifier {
  private tagMap: Record<string, TestTag[]> = {
    'login': ['smoke', 'auth'],
    'tenant-isolation': ['critical', 'isolation'],
    'subscription': ['regression'],
    'webhook': ['regression']
  }

  getTags(testName: string): TestTag[] {
    const key = Object.keys(this.tagMap).find(k => testName.toLowerCase().includes(k))
    return key ? this.tagMap[key] : ['regression']
  }

  isSmoke(testName: string): boolean {
    return this.getTags(testName).includes('smoke')
  }
}
