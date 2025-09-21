import React, { useEffect, useMemo, useState } from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'
// Advanced estimator (install: npm i @zxcvbn-ts/core)
// Lazy-load zxcvbn to reduce initial bundle size


const GeneratedPasswordCard = ({ password, onCopy }) => {
  const [zxcvbnFn, setZxcvbnFn] = useState(null)
  useEffect(() => {
    let mounted = true
    import('@zxcvbn-ts/core')
      .then((mod) => {
        if (mounted) setZxcvbnFn(() => mod.zxcvbn)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  const analysis = useMemo(() => {
    const val = password || ''
    if (!val) return { score: 0, label: 'Empty', crackTime: '', suggestions: [] }
    if (!zxcvbnFn) return { score: 0, label: 'Estimating…', crackTime: '', suggestions: [] }
    const r = zxcvbnFn(val)
    const score = r.score
    const label = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][score] || 'Unknown'
    const crackTime = r.crackTimesDisplay?.offlineSlowHashing1e4PerSecond || ''
    const suggestions = r.feedback?.suggestions || []
    return { score, label, crackTime, suggestions }
  }, [password, zxcvbnFn])

  return (
    <Card className="p-3">
      <div className="text-xs text-muted-foreground mb-2">Generated password</div>
      <div className="flex items-center gap-2">
        <Input
          type='text'
          readOnly
          value={password || ''}
          placeholder="Your password will appear here..."
          className="font-mono"
          onFocus={(e) => e.target.select()}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 w-2/3">
          <div className="h-1.5 w-full rounded bg-muted overflow-hidden">
            <div
              className={`h-full ${analysis.score <= 1 ? 'bg-red-500' : analysis.score === 2 ? 'bg-yellow-500' : analysis.score === 3 ? 'bg-blue-500' : 'bg-green-600'}`}
              style={{ width: `${(analysis.score / 4) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-muted-foreground">{analysis.label}</div>
      </div>
      {analysis.score <= 2 && analysis.suggestions.length > 0 && (
        <div className="mt-1 text-[10px] text-muted-foreground">
          {analysis.suggestions.join(' ')}
        </div>
      )}
      {analysis.crackTime && (
        <div className="mt-1 text-[10px] text-muted-foreground">Offline crack time: {analysis.crackTime}</div>
      )}
    </Card>
  )
}

export default GeneratedPasswordCard
