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
  PIN_LENGTH: 'pinLength'
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
  [STORAGE_KEYS.PIN_LENGTH]: 4
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
}

// Export singleton instance
const storageManager = new StorageManager()

export { storageManager, STORAGE_KEYS }
export default storageManager