import MemorablePasswordGenerator from '../memorablePasswordGenerator'

describe('MemorablePasswordGenerator', () => {
  const gen = new MemorablePasswordGenerator()

  test('generates passphrase within length bounds', () => {
    const p = gen.generateMemorablePassword({ wordCount: 3, minLength: 8, maxLength: 50 })
    expect(p.length).toBeGreaterThanOrEqual(8)
    expect(p.length).toBeLessThanOrEqual(50)
  })

  test('assessMemorableStrength returns object with entropy', () => {
    const p = 'Bright-Apple-123'
    const s = gen.assessMemorableStrength(p)
    expect(s).toHaveProperty('entropy')
    expect(typeof s.entropy).toBe('number')
  })
})
