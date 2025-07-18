/**
 * Chrome Storage utilities for password generator settings
 */

const STORAGE_KEYS = {
  THEME: 'theme',
  ACTIVE_TAB: 'activeTab',
  LENGTH: 'length',
  INCLUDE_NUMBERS: 'includeNumbers',
  INCLUDE_SYMBOLS: 'includeSymbols',
  SYMBOL_SET: 'symbolSet',
  CUSTOM_SYMBOLS: 'customSymbols',
  WORD_COUNT: 'wordCount',
  INCLUDE_CAPITALIZATION: 'includeCapitalization',
  PIN_LENGTH: 'pinLength',
  PASSWORD_HISTORY: 'passwordHistory'
}

const DEFAULT_SETTINGS = {
  [STORAGE_KEYS.THEME]: 'system',
  [STORAGE_KEYS.ACTIVE_TAB]: 'random',
  [STORAGE_KEYS.LENGTH]: 20,
  [STORAGE_KEYS.INCLUDE_NUMBERS]: true,
  [STORAGE_KEYS.INCLUDE_SYMBOLS]: false,
  [STORAGE_KEYS.SYMBOL_SET]: 'basic',
  [STORAGE_KEYS.CUSTOM_SYMBOLS]: '',
  [STORAGE_KEYS.WORD_COUNT]: 3,
  [STORAGE_KEYS.INCLUDE_CAPITALIZATION]: true,
  [STORAGE_KEYS.PIN_LENGTH]: 4,
  [STORAGE_KEYS.PASSWORD_HISTORY]: []
}

class StorageManager {
  constructor() {
    this.storage = chrome?.storage?.local || null
  }

  /**
   * Check if Chrome storage is available
   */
  isAvailable() {
    return this.storage !== null
  }

  /**
   * Get a single setting value
   * @param {string} key - Storage key
   * @returns {Promise<any>} - Setting value or default
   */
  async getSetting(key) {
    if (!this.isAvailable()) {
      return DEFAULT_SETTINGS[key]
    }

    try {
      const result = await this.storage.get(key)
      return result[key] !== undefined ? result[key] : DEFAULT_SETTINGS[key]
    } catch (error) {
      console.error('Error getting setting:', error)
      return DEFAULT_SETTINGS[key]
    }
  }

  /**
   * Get multiple settings
   * @param {string[]} keys - Array of storage keys
   * @returns {Promise<Object>} - Settings object
   */
  async getSettings(keys) {
    if (!this.isAvailable()) {
      const settings = {}
      keys.forEach(key => {
        settings[key] = DEFAULT_SETTINGS[key]
      })
      return settings
    }

    try {
      const result = await this.storage.get(keys)
      const settings = {}
      keys.forEach(key => {
        settings[key] = result[key] !== undefined ? result[key] : DEFAULT_SETTINGS[key]
      })
      return settings
    } catch (error) {
      console.error('Error getting settings:', error)
      const settings = {}
      keys.forEach(key => {
        settings[key] = DEFAULT_SETTINGS[key]
      })
      return settings
    }
  }

  /**
   * Get all settings
   * @returns {Promise<Object>} - All settings
   */
  async getAllSettings() {
    return this.getSettings(Object.keys(DEFAULT_SETTINGS))
  }

  /**
   * Set a single setting value
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  async setSetting(key, value) {
    if (!this.isAvailable()) {
      console.warn('Chrome storage not available, using localStorage fallback')
      localStorage.setItem(key, JSON.stringify(value))
      return
    }

    try {
      await this.storage.set({ [key]: value })
    } catch (error) {
      console.error('Error setting value:', error)
      // Fallback to localStorage
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * Set multiple settings
   * @param {Object} settings - Settings object to store
   */
  async setSettings(settings) {
    if (!this.isAvailable()) {
      console.warn('Chrome storage not available, using localStorage fallback')
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      return
    }

    try {
      await this.storage.set(settings)
    } catch (error) {
      console.error('Error setting settings:', error)
      // Fallback to localStorage
      Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
    }
  }

  /**
   * Remove a setting
   * @param {string} key - Storage key to remove
   */
  async removeSetting(key) {
    if (!this.isAvailable()) {
      localStorage.removeItem(key)
      return
    }

    try {
      await this.storage.remove(key)
    } catch (error) {
      console.error('Error removing setting:', error)
      localStorage.removeItem(key)
    }
  }

  /**
   * Clear all settings
   */
  async clearAll() {
    if (!this.isAvailable()) {
      Object.keys(DEFAULT_SETTINGS).forEach(key => {
        localStorage.removeItem(key)
      })
      return
    }

    try {
      await this.storage.clear()
    } catch (error) {
      console.error('Error clearing storage:', error)
      Object.keys(DEFAULT_SETTINGS).forEach(key => {
        localStorage.removeItem(key)
      })
    }
  }

  /**
   * Listen for storage changes
   * @param {Function} callback - Callback function for changes
   */
  onChanged(callback) {
    if (!this.isAvailable()) {
      return
    }

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        callback(changes)
      }
    })
  }

  /**
   * Add a password action to history
   * @param {string} action - Action type ('copy' or 'autofill')
   * @param {string} passwordType - Type of password ('random', 'memorable', 'pin')
   * @param {string} website - Website URL where action occurred
   * @param {number} passwordLength - Length of the password
   */
  async addPasswordHistory(action, passwordType, website = '', passwordLength = 0) {
    try {
      const currentHistory = await this.getSetting(STORAGE_KEYS.PASSWORD_HISTORY)
      const historyEntry = {
        id: Date.now() + Math.random(), // Unique ID
        action,
        passwordType,
        website,
        passwordLength,
        timestamp: new Date().toISOString(),
        domain: website ? new URL(website).hostname : ''
      }

      // Add to beginning of array and limit to 100 entries
      const updatedHistory = [historyEntry, ...currentHistory].slice(0, 100)
      
      await this.setSetting(STORAGE_KEYS.PASSWORD_HISTORY, updatedHistory)
      return historyEntry
    } catch (error) {
      console.error('Error adding password history:', error)
      return null
    }
  }

  /**
   * Get password history
   * @param {number} limit - Maximum number of entries to return
   * @returns {Promise<Array>} - Array of history entries
   */
  async getPasswordHistory(limit = 50) {
    try {
      const history = await this.getSetting(STORAGE_KEYS.PASSWORD_HISTORY)
      return Array.isArray(history) ? history.slice(0, limit) : []
    } catch (error) {
      console.error('Error getting password history:', error)
      return []
    }
  }

  /**
   * Clear password history
   */
  async clearPasswordHistory() {
    try {
      await this.setSetting(STORAGE_KEYS.PASSWORD_HISTORY, [])
    } catch (error) {
      console.error('Error clearing password history:', error)
    }
  }

  /**
   * Remove a specific history entry
   * @param {string|number} entryId - ID of the entry to remove
   */
  async removePasswordHistoryEntry(entryId) {
    try {
      const currentHistory = await this.getSetting(STORAGE_KEYS.PASSWORD_HISTORY)
      const updatedHistory = currentHistory.filter(entry => entry.id !== entryId)
      await this.setSetting(STORAGE_KEYS.PASSWORD_HISTORY, updatedHistory)
    } catch (error) {
      console.error('Error removing password history entry:', error)
    }
  }

  /**
   * Get password history statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getPasswordHistoryStats() {
    try {
      const history = await this.getSetting(STORAGE_KEYS.PASSWORD_HISTORY)
      const stats = {
        total: history.length,
        copyCount: 0,
        autofillCount: 0,
        topWebsites: {},
        passwordTypes: { random: 0, memorable: 0, pin: 0 },
        lastSevenDays: 0
      }

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      history.forEach(entry => {
        // Count actions
        if (entry.action === 'copy') stats.copyCount++
        if (entry.action === 'autofill') stats.autofillCount++

        // Count password types
        if (stats.passwordTypes[entry.passwordType] !== undefined) {
          stats.passwordTypes[entry.passwordType]++
        }

        // Count websites
        if (entry.domain) {
          stats.topWebsites[entry.domain] = (stats.topWebsites[entry.domain] || 0) + 1
        }

        // Count recent actions
        if (new Date(entry.timestamp) > sevenDaysAgo) {
          stats.lastSevenDays++
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting password history stats:', error)
      return { total: 0, copyCount: 0, autofillCount: 0, topWebsites: {}, passwordTypes: { random: 0, memorable: 0, pin: 0 }, lastSevenDays: 0 }
    }
  }
}

// Export singleton instance
const storageManager = new StorageManager()

export { storageManager, STORAGE_KEYS }
export default storageManager