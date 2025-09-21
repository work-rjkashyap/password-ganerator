import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

/**
 * Simple Combobox
 * props:
 * - value: current value
 * - onChange: (value) => void
 * - options: [{ value, label, preview }]
 * - placeholder
 * - className
 */
const Combobox = ({ value, onChange, options = [], placeholder = '', className = '' }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const selected = options.find(o => o.value === value)
  const list = query
    ? options.filter(o => (o.label + ' ' + (o.preview || '')).toLowerCase().includes(query.toLowerCase()))
    : options

  const onKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight(h => Math.min(h + 1, list.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const opt = list[highlight]
      if (opt) onChange(opt.value)
      setOpen(false)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div className="flex items-center">
        <input
          className="w-full px-3 py-2 rounded-md border border-input bg-popover text-popover-foreground placeholder:text-muted-foreground text-sm"
          placeholder={placeholder}
          value={open ? query : (selected ? selected.label : '')}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlight(0) }}
          onFocus={() => { setOpen(true); setQuery('') }}
          onKeyDown={onKeyDown}
          aria-expanded={open}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md max-h-48 overflow-auto">
          {list.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted">No results</div>
          ) : (
            list.map((opt, idx) => (
              <button
                key={opt.value}
                className={cn('w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex flex-col', idx === highlight ? 'bg-accent text-accent-foreground' : '')}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                type="button"
              >
                <span className="font-medium">{opt.label}</span>
                {opt.preview && <span className="text-xs text-muted truncate">{opt.preview}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export { Combobox }
