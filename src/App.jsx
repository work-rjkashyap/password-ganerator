import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Shuffle, Lightbulb, Hash, Copy, RefreshCw, Moon, Sun, ChevronDown, Send, History, Clock, Globe, Trash2, X, Download } from 'lucide-react'
import SecurePasswordGenerator from './securePasswordGenerator.js'
import MemorablePasswordGenerator from './memorablePasswordGenerator.js'
import storageManager, { STORAGE_KEYS } from './storageUtils.js'

const App = () => {
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('random')
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [autoFilled, setAutoFilled] = useState(false)
  const [autoFillMessage, setAutoFillMessage] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [historyData, setHistoryData] = useState([])
  const [historyStats, setHistoryStats] = useState(null)
  
  // Random password settings
  const [length, setLength] = useState(20)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [symbolSet, setSymbolSet] = useState('basic')
  const [customSymbols, setCustomSymbols] = useState('')
  const [showSymbolOptions, setShowSymbolOptions] = useState(false)
  
  // Memorable password settings
  const [wordCount, setWordCount] = useState(3)
  const [includeCapitalization, setIncludeCapitalization] = useState(true)
  
  // PIN settings
  const [pinLength, setPinLength] = useState(4)

  const passwordGenerator = useMemo(() => new SecurePasswordGenerator(), [])
  const memorableGenerator = useMemo(() => new MemorablePasswordGenerator(), [])
  const symbolSets = useMemo(() => passwordGenerator.getSymbolSets(), [passwordGenerator])

  // Load saved preferences on app start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const settings = await storageManager.getAllSettings()
        
        // Set all preferences from storage
        setActiveTab(settings[STORAGE_KEYS.ACTIVE_TAB])
        setLength(settings[STORAGE_KEYS.LENGTH])
        setIncludeNumbers(settings[STORAGE_KEYS.INCLUDE_NUMBERS])
        setIncludeSymbols(settings[STORAGE_KEYS.INCLUDE_SYMBOLS])
        setSymbolSet(settings[STORAGE_KEYS.SYMBOL_SET])
        setCustomSymbols(settings[STORAGE_KEYS.CUSTOM_SYMBOLS])
        setWordCount(settings[STORAGE_KEYS.WORD_COUNT])
        setIncludeCapitalization(settings[STORAGE_KEYS.INCLUDE_CAPITALIZATION])
        setPinLength(settings[STORAGE_KEYS.PIN_LENGTH])

        // Handle theme preference
        const savedTheme = settings[STORAGE_KEYS.THEME]
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        
        let shouldBeDark = false
        if (savedTheme === 'dark') {
          shouldBeDark = true
        } else if (savedTheme === 'light') {
          shouldBeDark = false
        } else {
          shouldBeDark = prefersDark
        }
        
        setIsDarkMode(shouldBeDark)
        
        if (shouldBeDark) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
        
        // Generate initial password after preferences are loaded
        setTimeout(() => {
          generatePassword()
        }, 100)
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    }

    loadPreferences()
  }, [])

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      storageManager.setSetting(STORAGE_KEYS.THEME, 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      storageManager.setSetting(STORAGE_KEYS.THEME, 'light')
    }
  }, [isDarkMode])

  // Save preferences when they change
  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.ACTIVE_TAB, activeTab)
  }, [activeTab])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.LENGTH, length)
  }, [length])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.INCLUDE_NUMBERS, includeNumbers)
  }, [includeNumbers])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.INCLUDE_SYMBOLS, includeSymbols)
  }, [includeSymbols])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.SYMBOL_SET, symbolSet)
  }, [symbolSet])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.CUSTOM_SYMBOLS, customSymbols)
  }, [customSymbols])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.WORD_COUNT, wordCount)
  }, [wordCount])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.INCLUDE_CAPITALIZATION, includeCapitalization)
  }, [includeCapitalization])

  useEffect(() => {
    storageManager.setSetting(STORAGE_KEYS.PIN_LENGTH, pinLength)
  }, [pinLength])

  const generatePassword = useCallback(() => {
    try {
      let generatedPassword = ''
      
      if (activeTab === 'random') {
        const options = {
          length,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers,
          includeSymbols,
          symbolSet,
          customSymbols,
          excludeAmbiguous: false,
          ensureComplexity: true
        }

        const validation = passwordGenerator.validateOptions(options)
        if (!validation.isValid) {
          alert(validation.errors.join('\n'))
          return
        }

        generatedPassword = passwordGenerator.generateSecurePassword(options)
      } else if (activeTab === 'memorable') {
        const options = {
          wordCount,
          includeNumbers: true,
          includeCapitalization,
          separatorType: 'random',
          minLength: 8,
          maxLength: 50
        }
        
        generatedPassword = memorableGenerator.generateMemorablePassword(options)
      } else if (activeTab === 'pin') {
        generatedPassword = generatePIN(pinLength)
      }
      
      setPassword(generatedPassword)
      setCopied(false)
    } catch (error) {
      console.error('Password generation error:', error)
      alert('Failed to generate password. Please try again.')
    }
  }, [activeTab, length, includeNumbers, includeSymbols, wordCount, includeCapitalization, pinLength, passwordGenerator, memorableGenerator, symbolSet, customSymbols])

  // Generate password when tab changes
  useEffect(() => {
    generatePassword()
  }, [activeTab, generatePassword])

  // Load history data
  const loadHistoryData = useCallback(async () => {
    try {
      const history = await storageManager.getPasswordHistory(20)
      const stats = await storageManager.getPasswordHistoryStats()
      setHistoryData(history)
      setHistoryStats(stats)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }, [])

  // Load history when component mounts or when history panel is opened
  useEffect(() => {
    if (showHistory) {
      loadHistoryData()
    }
  }, [showHistory, loadHistoryData])

  const clearHistory = async () => {
    try {
      await storageManager.clearPasswordHistory()
      setHistoryData([])
      setHistoryStats(null)
      await loadHistoryData()
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  const removeHistoryEntry = async (entryId) => {
    try {
      await storageManager.removePasswordHistoryEntry(entryId)
      await loadHistoryData()
    } catch (error) {
      console.error('Failed to remove history entry:', error)
    }
  }

  const exportHistory = async () => {
    try {
      const history = await storageManager.getPasswordHistory()
      const stats = await storageManager.getPasswordHistoryStats()
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        stats,
        history: history.map(entry => ({
          ...entry,
          // Remove sensitive data if any
          id: entry.id,
          action: entry.action,
          passwordType: entry.passwordType,
          domain: entry.domain,
          passwordLength: entry.passwordLength,
          timestamp: entry.timestamp
        }))
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `password-history-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export history:', error)
    }
  }

  const generatePIN = (length) => {
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    
    let pin = ''
    for (let i = 0; i < length; i++) {
      pin += (array[i] % 10).toString()
    }
    
    return pin
  }

  const copyToClipboard = async () => {
    if (!password) return
    
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      // Track copy action in history
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        const website = tab?.url || ''
        await storageManager.addPasswordHistory('copy', activeTab, website, password.length)
      } catch (historyError) {
        console.error('Failed to track copy action:', historyError)
      }
    } catch (err) {
      console.error('Failed to copy password:', err)
    }
  }

  const autoFillPassword = async () => {
    if (!password) return
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillPassword',
        password: password
      })
      
      if (response.success) {
        setAutoFilled(true)
        setAutoFillMessage(response.message)
        setTimeout(() => {
          setAutoFilled(false)
          setAutoFillMessage('')
        }, 3000)
        
        // Track autofill action in history
        try {
          const website = tab?.url || ''
          await storageManager.addPasswordHistory('autofill', activeTab, website, password.length)
        } catch (historyError) {
          console.error('Failed to track autofill action:', historyError)
        }
      } else {
        setAutoFillMessage(response.message)
        setTimeout(() => setAutoFillMessage(''), 3000)
      }
    } catch (err) {
      console.error('Failed to auto-fill password:', err)
      setAutoFillMessage('Failed to auto-fill password')
      setTimeout(() => setAutoFillMessage(''), 3000)
    }
  }

  const getStrengthForCurrentType = () => {
    if (!password) return { score: 0, label: 'None', entropy: 0 }
    
    if (activeTab === 'random') {
      const options = {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous: false
      }
      return passwordGenerator.assessPasswordStrength(password, options)
    } else if (activeTab === 'memorable') {
      return memorableGenerator.assessMemorableStrength(password)
    } else if (activeTab === 'pin') {
      const entropy = pinLength * Math.log2(10)
      let score = 1
      if (entropy >= 20) score = 2
      if (entropy >= 30) score = 3
      if (entropy >= 40) score = 4
      if (entropy >= 50) score = 5
      
      const labels = ['None', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
      return { score, label: labels[score], entropy: Math.round(entropy) }
    }
    
    return { score: 0, label: 'None', entropy: 0 }
  }

  const strength = useMemo(() => getStrengthForCurrentType(), [
    password, activeTab, includeNumbers, includeSymbols, pinLength, passwordGenerator, memorableGenerator
  ])

  const renderTabContent = () => {
    if (activeTab === 'random') {
      return (
        <>
          <div className="slider-group">
            <label className="slider-label">Characters</label>
            <div className="slider-container">
              <input
                type="range"
                min="4"
                max="50"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-value">{length}</div>
            </div>
          </div>
          
          <div className="toggle-group">
            <div className="toggle-item">
              <label className="toggle-label">Numbers</label>
              <div 
                className={`toggle-switch ${includeNumbers ? 'active' : ''}`}
                onClick={() => setIncludeNumbers(!includeNumbers)}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
            
            <div className="toggle-item">
              <label className="toggle-label">Symbols</label>
              <div 
                className={`toggle-switch ${includeSymbols ? 'active' : ''}`}
                onClick={() => setIncludeSymbols(!includeSymbols)}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          {includeSymbols && (
            <div className="symbol-options">
              <div className="symbol-selector">
                <label className="symbol-selector-label">Symbol Set</label>
                <button 
                  className="symbol-dropdown-trigger"
                  onClick={() => setShowSymbolOptions(!showSymbolOptions)}
                >
                  <span>{symbolSets[symbolSet]?.name || 'Basic'}</span>
                  <ChevronDown size={14} className={`dropdown-icon ${showSymbolOptions ? 'rotated' : ''}`} />
                </button>
                
                {showSymbolOptions && (
                  <div className="symbol-dropdown">
                    {Object.entries(symbolSets).map(([key, set]) => (
                      <button
                        key={key}
                        className={`symbol-option ${symbolSet === key ? 'active' : ''}`}
                        onClick={() => {
                          setSymbolSet(key)
                          setShowSymbolOptions(false)
                        }}
                      >
                        <div className="symbol-option-info">
                          <span className="symbol-option-name">{set.name}</span>
                          <span className="symbol-option-preview">{set.symbols || 'Custom'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {symbolSet === 'custom' && (
                <div className="custom-symbols">
                  <label className="custom-symbols-label">Custom Symbols</label>
                  <input
                    type="text"
                    placeholder="Enter custom symbols"
                    value={customSymbols}
                    onChange={(e) => setCustomSymbols(e.target.value)}
                    className="custom-symbols-input"
                  />
                </div>
              )}
              
              <div className="symbol-preview">
                <span className="symbol-preview-label">Using: </span>
                <span className="symbol-preview-text">
                  {symbolSet === 'custom' ? customSymbols || 'No custom symbols' : symbolSets[symbolSet]?.symbols}
                </span>
              </div>
            </div>
          )}
        </>
      )
    } else if (activeTab === 'memorable') {
      return (
        <>
          <div className="slider-group">
            <label className="slider-label">Words</label>
            <div className="slider-container">
              <input
                type="range"
                min="2"
                max="6"
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="slider"
              />
              <div className="slider-value">{wordCount}</div>
            </div>
          </div>
          
          <div className="toggle-group">
            <div className="toggle-item">
              <label className="toggle-label">Capitalization</label>
              <div 
                className={`toggle-switch ${includeCapitalization ? 'active' : ''}`}
                onClick={() => setIncludeCapitalization(!includeCapitalization)}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </>
      )
    } else if (activeTab === 'pin') {
      return (
        <div className="slider-group">
          <label className="slider-label">Digits</label>
          <div className="slider-container">
            <input
              type="range"
              min="4"
              max="12"
              value={pinLength}
              onChange={(e) => setPinLength(parseInt(e.target.value))}
              className="slider"
            />
            <div className="slider-value">{pinLength}</div>
          </div>
        </div>
      )
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    
    return date.toLocaleDateString()
  }

  const getPasswordTypeIcon = (type) => {
    switch (type) {
      case 'random': return <Shuffle size={14} />
      case 'memorable': return <Lightbulb size={14} />
      case 'pin': return <Hash size={14} />
      default: return <Copy size={14} />
    }
  }

  const renderHistoryPanel = () => {
    if (!showHistory) return null

    return (
      <div className="history-panel">
        <div className="history-header">
          <div className="history-title">
            <History size={16} />
            <span>Password History</span>
          </div>
          <div className="history-actions">
            {historyData.length > 0 && (
              <>
                <button className="export-history-btn" onClick={exportHistory} title="Export history">
                  <Download size={14} />
                </button>
                <button className="clear-history-btn" onClick={clearHistory} title="Clear all history">
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <button className="close-history-btn" onClick={() => setShowHistory(false)} title="Close history">
              <X size={14} />
            </button>
          </div>
        </div>

        {historyStats && (
          <div className="history-stats">
            <div className="stat-item">
              <span className="stat-label">Total Actions:</span>
              <span className="stat-value">{historyStats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last 7 Days:</span>
              <span className="stat-value">{historyStats.lastSevenDays}</span>
            </div>
            <div className="stat-row">
              <div className="stat-item">
                <Copy size={12} />
                <span className="stat-value">{historyStats.copyCount}</span>
              </div>
              <div className="stat-item">
                <Send size={12} />
                <span className="stat-value">{historyStats.autofillCount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="history-list">
          {historyData.length === 0 ? (
            <div className="empty-history">
              <History size={32} />
              <p>No password history yet</p>
              <p>Your copy and autofill actions will appear here</p>
            </div>
          ) : (
            historyData.map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-item-icon">
                  {getPasswordTypeIcon(entry.passwordType)}
                </div>
                <div className="history-item-content">
                  <div className="history-item-main">
                    <div className="history-item-action">
                      <span className={`action-badge ${entry.action}`}>
                        {entry.action === 'copy' ? <Copy size={12} /> : <Send size={12} />}
                        {entry.action === 'copy' ? 'Copied' : 'Auto-filled'}
                      </span>
                      <span className="password-type">{entry.passwordType}</span>
                      <span className="password-length">({entry.passwordLength} chars)</span>
                    </div>
                    <div className="history-item-website">
                      {entry.domain ? (
                        <div className="website-info">
                          <Globe size={12} />
                          <span>{entry.domain}</span>
                        </div>
                      ) : (
                        <span className="no-website">Extension popup</span>
                      )}
                    </div>
                  </div>
                  <div className="history-item-meta">
                    <div className="history-item-time">
                      <Clock size={12} />
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                    <button 
                      className="remove-entry-btn"
                      onClick={() => removeHistoryEntry(entry.id)}
                      title="Remove this entry"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="header-section">
        <h1 className="app-title">Choose password type</h1>
        <div className="header-actions">
          <button className="history-toggle" onClick={() => setShowHistory(!showHistory)} title="View password history">
            <History size={16} />
          </button>
          <button className="dark-mode-toggle" onClick={toggleDarkMode} title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div className="tab-group">
          <button 
            className={`tab-button ${activeTab === 'random' ? 'active' : ''}`}
            onClick={() => setActiveTab('random')}
          >
            <Shuffle className="tab-icon" size={14} />
            <span className="tab-label">Random</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'memorable' ? 'active' : ''}`}
            onClick={() => setActiveTab('memorable')}
          >
            <Lightbulb className="tab-icon" size={14} />
            <span className="tab-label">Memorable</span>
          </button>
          
          <button 
            className={`tab-button ${activeTab === 'pin' ? 'active' : ''}`}
            onClick={() => setActiveTab('pin')}
          >
            <Hash className="tab-icon" size={14} />
            <span className="tab-label">PIN</span>
          </button>
        </div>
      </div>
      
      <div className="content-section">
        <h2 className="section-title">Customize your new password</h2>
        
        <div className="controls-section">
          {renderTabContent()}
        </div>
        
        <div className="password-section">
          <h3 className="password-title">Generated password</h3>
          <div className="password-display">
            {password || 'Your password will appear here...'}
          </div>
        </div>
        
        <div className="button-section">
          <button className="copy-button" onClick={copyToClipboard} disabled={!password}>
            <Copy size={14} />
            Copy password
          </button>
          <button className="autofill-button" onClick={autoFillPassword} disabled={!password}>
            <Send size={14} />
            Auto-fill
          </button>
          <button className="refresh-button" onClick={generatePassword}>
            <RefreshCw size={14} />
            Refresh password
          </button>
        </div>
        
        {copied && (
          <div className="success-message">
            Password copied to clipboard!
          </div>
        )}
        
        {autoFilled && (
          <div className="success-message">
            {autoFillMessage}
          </div>
        )}
        
        {!autoFilled && autoFillMessage && (
          <div className="error-message">
            {autoFillMessage}
          </div>
        )}
      </div>
      
      {renderHistoryPanel()}
    </div>
  )
}

export default App