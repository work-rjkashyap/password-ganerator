import SecurePasswordGenerator from '../securePasswordGenerator'

describe('SecurePasswordGenerator', () => {
  const gen = new SecurePasswordGenerator()

  test('generates password of requested length', () => {
    const p = gen.generateSecurePassword({ length: 12, includeSymbols: false })
    expect(p).toHaveLength(12)
  })

  test('ensures complexity when requested', () => {
    const options = { length: 12, includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, ensureComplexity: true }
    const p = gen.generateSecurePassword(options)
    expect(/[A-Z]/.test(p)).toBe(true)
    expect(/[a-z]/.test(p)).toBe(true)
    expect(/[0-9]/.test(p)).toBe(true)
    expect(p.length).toBeGreaterThanOrEqual(12)
  })

  test('calculateEntropy returns a number', () => {
    const p = 'Abc123!@#'
    const e = gen.calculateEntropy(p, { includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true })
    expect(typeof e).toBe('number')
    expect(Number.isFinite(e)).toBe(true)
  })
})
