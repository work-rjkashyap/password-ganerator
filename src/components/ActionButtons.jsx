import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { ClipboardCopy, CopyCheck, Send, BadgeCheck, RefreshCcw, Sparkles } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'
import { cn } from '@/lib/utils'

const ActionButtons = ({ onCopy, onAutofill, onRefresh, disabled }) => {
  const [copyStatus, setCopyStatus] = useState('idle')
  const [autofillStatus, setAutofillStatus] = useState('idle')
  const [refreshStatus, setRefreshStatus] = useState('idle')
  const timersRef = useRef({ copy: null, autofill: null, refresh: null })

  const resetAfterDelay = (key, setter) => {
    if (timersRef.current[key]) clearTimeout(timersRef.current[key])
    timersRef.current[key] = setTimeout(() => {
      setter('idle')
      timersRef.current[key] = null
    }, 1000)
  }

  useEffect(() => () => {
    Object.values(timersRef.current).forEach(t => t && clearTimeout(t))
  }, [])

  const handleCopyClick = async () => {
    if (disabled) return
    try {
      await Promise.resolve(onCopy?.())
      setCopyStatus('success')
      resetAfterDelay('copy', setCopyStatus)
    } catch (err) {
      setCopyStatus('idle')
    }
  }

  const handleAutofillClick = async () => {
    if (disabled) return
    try {
      await Promise.resolve(onAutofill?.())
      setAutofillStatus('success')
      resetAfterDelay('autofill', setAutofillStatus)
    } catch (err) {
      setAutofillStatus('idle')
    }
  }

  const handleRefreshClick = async () => {
    try {
      await Promise.resolve(onRefresh?.())
      setRefreshStatus('success')
      resetAfterDelay('refresh', setRefreshStatus)
    } catch (err) {
      setRefreshStatus('idle')
    }
  }

  const copyGlowClass = copyStatus === 'success'
    ? 'bg-gradient-radial from-emerald-500/40 via-emerald-500/15 to-transparent opacity-100'
    : 'bg-gradient-radial from-primary/30 via-primary/10 to-transparent'

  const autofillGlowClass = autofillStatus === 'success'
    ? 'bg-gradient-to-r from-sky-500/40 via-sky-400/15 to-transparent opacity-100'
    : 'bg-gradient-to-r from-secondary/40 via-secondary/10 to-transparent'

  const refreshGlowClass = refreshStatus === 'success'
    ? 'bg-gradient-to-tr from-amber-500/40 via-amber-400/15 to-transparent opacity-100'
    : 'bg-gradient-to-tr from-primary/40 via-primary/10 to-transparent'

  return (
    <TooltipProvider>
      <div className="flex gap-2 justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleCopyClick}
              disabled={disabled}
              aria-label="Copy password"
              className="group relative overflow-hidden transition-transform active:scale-95"
            >
              <span
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100',
                  copyGlowClass,
                  copyStatus === 'success' && 'opacity-100'
                )}
              />
              {copyStatus === 'success' ? (
                <CopyCheck size={16} className="relative z-10 text-emerald-500 transition-transform duration-300 group-active:scale-90" />
              ) : (
                <ClipboardCopy size={16} className="relative z-10 transition-transform duration-300 group-hover:rotate-3 group-active:scale-90" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy password</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAutofillClick}
              disabled={disabled}
              aria-label="Auto-fill"
              className="group relative overflow-hidden transition-transform active:scale-95"
            >
              <span
                className={cn(
                  'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100',
                  autofillGlowClass,
                  autofillStatus === 'success' && 'opacity-100'
                )}
              />
              {autofillStatus === 'success' ? (
                <BadgeCheck size={16} className="relative z-10 text-sky-500 transition-transform duration-300 group-active:scale-90" />
              ) : (
                <Send size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-active:scale-90" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Auto-fill</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleRefreshClick}
              aria-label="Regenerate"
              className="group relative overflow-hidden transition-transform active:scale-95"
            >
              <span
                className={cn(
                  'pointer-events-none absolute inset-[-1px] rotate-45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100',
                  refreshGlowClass,
                  refreshStatus === 'success' && 'opacity-100'
                )}
              />
              {refreshStatus === 'success' ? (
                <Sparkles size={16} className="relative z-10 text-amber-500 transition-transform duration-500 group-active:scale-90" />
              ) : (
                <RefreshCcw size={16} className="relative z-10 transition-transform duration-500 group-hover:rotate-90 group-active:scale-90" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Regenerate</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default ActionButtons
