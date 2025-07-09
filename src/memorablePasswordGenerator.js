class MemorablePasswordGenerator {
  constructor() {
    this.words = [
      'apple', 'banana', 'cherry', 'dragon', 'elephant', 'falcon', 'guitar', 'horizon',
      'island', 'jungle', 'knight', 'lemon', 'mountain', 'ocean', 'planet', 'queen',
      'rainbow', 'sunset', 'thunder', 'universe', 'victory', 'wizard', 'xenon', 'yellow',
      'zebra', 'anchor', 'bridge', 'castle', 'diamond', 'eagle', 'forest', 'galaxy',
      'hammer', 'iceberg', 'journey', 'kingdom', 'lighthouse', 'magnet', 'ninja', 'orbit',
      'phoenix', 'quartz', 'rocket', 'silver', 'tiger', 'umbrella', 'volcano', 'warrior',
      'crystal', 'breeze', 'storm', 'flower', 'river', 'star', 'moon', 'fire', 'water',
      'earth', 'wind', 'light', 'shadow', 'dream', 'spirit', 'power', 'magic', 'truth',
      'peace', 'love', 'hope', 'joy', 'freedom', 'wisdom', 'courage', 'strength', 'honor'
    ]
    
    this.adjectives = [
      'bright', 'swift', 'strong', 'gentle', 'brave', 'wise', 'cool', 'warm', 'dark',
      'light', 'fast', 'slow', 'big', 'small', 'loud', 'quiet', 'smooth', 'rough',
      'sharp', 'soft', 'hard', 'easy', 'tough', 'sweet', 'sour', 'hot', 'cold',
      'fresh', 'old', 'new', 'clean', 'dirty', 'rich', 'poor', 'happy', 'sad',
      'angry', 'calm', 'wild', 'tame', 'free', 'bound', 'open', 'closed', 'clear',
      'cloudy', 'sunny', 'rainy', 'snowy', 'windy', 'still', 'moving', 'stable'
    ]
    
    this.separators = ['-', '_', '.', '!', '@', '#', '$', '%', '^', '&', '*']
  }

  /**
   * Generate a memorable password using words
   * @param {Object} options - Generation options
   * @returns {string} - Generated memorable password
   */
  generateMemorablePassword(options = {}) {
    const {
      wordCount = 3,
      includeNumbers = true,
      includeCapitalization = true,
      separatorType = 'random', // 'random', 'dash', 'underscore', 'none'
      minLength = 8,
      maxLength = 50
    } = options

    let password = ''
    let attempts = 0
    const maxAttempts = 50

    while (attempts < maxAttempts) {
      const words = this.selectWords(wordCount, includeCapitalization)
      const separator = this.getSeparator(separatorType)
      const numbers = includeNumbers ? this.getRandomNumbers() : ''
      
      password = words.join(separator) + numbers
      
      if (password.length >= minLength && password.length <= maxLength) {
        break
      }
      
      attempts++
    }

    return password
  }

  /**
   * Select random words for the password
   * @param {number} count - Number of words to select
   * @param {boolean} includeCapitalization - Whether to capitalize words
   * @returns {Array} - Array of selected words
   */
  selectWords(count, includeCapitalization) {
    const selectedWords = []
    
    for (let i = 0; i < count; i++) {
      let word
      
      if (i === 0 && Math.random() < 0.5) {
        // Sometimes start with an adjective
        word = this.getRandomWord(this.adjectives)
      } else {
        word = this.getRandomWord(this.words)
      }
      
      if (includeCapitalization) {
        word = this.capitalizeWord(word)
      }
      
      selectedWords.push(word)
    }
    
    return selectedWords
  }

  /**
   * Get a random word from an array
   * @param {Array} wordArray - Array of words to choose from
   * @returns {string} - Random word
   */
  getRandomWord(wordArray) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const index = array[0] % wordArray.length
    return wordArray[index]
  }

  /**
   * Capitalize a word randomly
   * @param {string} word - Word to capitalize
   * @returns {string} - Capitalized word
   */
  capitalizeWord(word) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const random = array[0] % 3
    
    if (random === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    } else if (random === 1) {
      return word.toUpperCase()
    } else {
      return word
    }
  }

  /**
   * Get separator based on type
   * @param {string} separatorType - Type of separator
   * @returns {string} - Separator character
   */
  getSeparator(separatorType) {
    if (separatorType === 'none') return ''
    if (separatorType === 'dash') return '-'
    if (separatorType === 'underscore') return '_'
    
    // Random separator
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const index = array[0] % this.separators.length
    return this.separators[index]
  }

  /**
   * Generate random numbers to append
   * @returns {string} - Random numbers
   */
  getRandomNumbers() {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    const numberCount = (array[0] % 3) + 1 // 1-3 numbers
    
    let numbers = ''
    for (let i = 0; i < numberCount; i++) {
      const digitArray = new Uint32Array(1)
      crypto.getRandomValues(digitArray)
      numbers += (digitArray[0] % 10).toString()
    }
    
    return numbers
  }

  /**
   * Generate passphrase with specific pattern
   * @param {Object} options - Generation options
   * @returns {string} - Generated passphrase
   */
  generatePassphrase(options = {}) {
    const {
      pattern = 'Adjective-Noun-Number',
      length = 4
    } = options

    const patterns = {
      'Adjective-Noun-Number': () => {
        const adjective = this.capitalizeWord(this.getRandomWord(this.adjectives))
        const noun = this.capitalizeWord(this.getRandomWord(this.words))
        const number = this.getRandomNumbers()
        return `${adjective}-${noun}-${number}`
      },
      'Word-Word-Word': () => {
        const words = this.selectWords(3, true)
        return words.join('-')
      },
      'Mixed': () => {
        const wordCount = Math.floor(Math.random() * 3) + 2 // 2-4 words
        return this.generateMemorablePassword({ wordCount })
      }
    }

    return patterns[pattern] ? patterns[pattern]() : this.generateMemorablePassword({ wordCount: length })
  }

  /**
   * Assess memorable password strength
   * @param {string} password - Password to assess
   * @returns {Object} - Strength assessment
   */
  assessMemorableStrength(password) {
    if (!password) return { score: 0, label: 'None', entropy: 0 }

    let entropy = 0
    let score = 0

    // Estimate entropy based on word count and complexity
    const wordCount = password.split(/[-_.\s]/).length
    const hasNumbers = /\d/.test(password)
    const hasCapitals = /[A-Z]/.test(password)
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)

    // Base entropy from word selection (assuming 1000 word vocabulary)
    entropy += wordCount * Math.log2(1000)

    // Additional entropy from numbers
    if (hasNumbers) entropy += 10 // ~3 digits from 10^3 possibilities

    // Additional entropy from capitalization patterns
    if (hasCapitals) entropy += wordCount * Math.log2(3) // 3 capitalization options per word

    // Additional entropy from separators
    if (hasSymbols) entropy += Math.log2(10) // ~10 separator options

    // Score based on entropy
    if (entropy < 30) score = 1
    else if (entropy < 50) score = 2
    else if (entropy < 70) score = 3
    else if (entropy < 90) score = 4
    else score = 5

    const labels = ['None', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    
    return {
      score,
      label: labels[score],
      entropy: Math.round(entropy),
      wordCount,
      hasNumbers,
      hasCapitals,
      hasSymbols
    }
  }
}

export default MemorablePasswordGenerator