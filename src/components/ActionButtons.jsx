import React from 'react'
import { Button } from './ui/button'
import { Copy, Send, RefreshCw } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'

const ActionButtons = ({ onCopy, onAutofill, onRefresh, disabled }) => {
  return (
    <TooltipProvider>
      <div className="flex gap-2 justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onCopy} disabled={disabled} aria-label="Copy password">
              <Copy size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy password</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onAutofill} disabled={disabled} aria-label="Auto-fill">
              <Send size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Auto-fill</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="icon" onClick={onRefresh} aria-label="Regenerate">
              <RefreshCw size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Regenerate</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default ActionButtons
