import React, { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }   from './ui/select'
import { Combobox } from './ui/Combobox'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Slider } from './ui/slider'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'

const PasswordControls = ({
  activeTab,
  length, setLength,
  includeNumbers, setIncludeNumbers,
  includeSymbols, setIncludeSymbols,
  symbolSet, setSymbolSet,
  customSymbols, setCustomSymbols,
  symbolSets,
  wordCount, setWordCount,
  includeCapitalization, setIncludeCapitalization,
  pinLength, setPinLength
}) => {
  const [draggingLen, setDraggingLen] = useState(false)
  const [draggingWords, setDraggingWords] = useState(false)
  const [draggingPin, setDraggingPin] = useState(false)
  if (activeTab === 'random') {
    return (
      <Card>
        <CardHeader className="pb-1 pt-3 px-4">
          <CardTitle className="text-sm">Random Password Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2 px-4 pb-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground">Characters</label>
          <div className="flex items-center gap-3">
            <span className="w-4 text-xs text-muted-foreground">4</span>
            <div className="relative flex-1 group"
              onMouseDown={() => setDraggingLen(true)}
              onMouseUp={() => setDraggingLen(false)}
              onMouseLeave={() => setDraggingLen(false)}
              onTouchStart={() => setDraggingLen(true)}
              onTouchEnd={() => setDraggingLen(false)}
            >
              <Slider
                value={[length]}
                min={4}
                max={50}
                onValueChange={(val) => setLength(val[0])}
                aria-label="Characters"
              />
              <div
                className="absolute -top-7 translate-x-[-50%] text-[10px] px-1.5 py-0.5 rounded bg-popover text-popover-foreground border shadow transition-all duration-150 ease-out"
                style={{ left: `${Math.min(100, Math.max(0, ((length - 4) / (50 - 4)) * 100))}%` }}
                data-active={draggingLen ? 'true' : 'false'}
              >
                {length}
              </div>
            </div>
            <span className="w-6 text-xs text-muted-foreground text-right">50</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground w-10 text-right cursor-default">{length}</div>
                </TooltipTrigger>
                <TooltipContent>Characters: {length}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
          <div className="flex items-center gap-2">
            <Switch id="includeNumbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
            <label htmlFor="includeNumbers" className="text-sm text-foreground">Numbers</label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="includeSymbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
            <label htmlFor="includeSymbols" className="text-sm text-foreground">Symbols</label>
          </div>
        </div>

        {includeSymbols && (
          <Card className="symbol-options border-dashed bg-muted/20">
            <CardHeader className="pb-1 pt-3 px-4">
              <CardTitle className="text-sm">Symbols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 px-4 pb-4">
              <Combobox
                value={symbolSet}
                onChange={(v) => setSymbolSet(v)}
                placeholder="Select symbol set"
                options={Object.entries(symbolSets).map(([key, set]) => ({ value: key, label: set.name, preview: set.symbols }))}
                className="w-full"
              />

              {symbolSet === 'custom' && (
                <div>
                  <label className="text-sm text-foreground">Custom Symbols</label>
                  <Input
                    placeholder="Enter custom symbols"
                    value={customSymbols}
                    onChange={setCustomSymbols}
                  />
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                <span className="mr-1">Using:</span>
                <span>
                  {symbolSet === 'custom' ? customSymbols || 'No custom symbols' : symbolSets[symbolSet]?.symbols}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        </CardContent>
      </Card>
    )
  }

  if (activeTab === 'memorable') {
    return (
      <Card>
        <CardHeader className="pb-1 pt-3 px-4">
          <CardTitle className="text-sm">Memorable Password Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2 px-4 pb-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground">Words</label>
          <div className="flex items-center gap-3">
            <span className="w-4 text-xs text-muted-foreground">2</span>
            <div className="relative flex-1 group"
              onMouseDown={() => setDraggingWords(true)}
              onMouseUp={() => setDraggingWords(false)}
              onMouseLeave={() => setDraggingWords(false)}
              onTouchStart={() => setDraggingWords(true)}
              onTouchEnd={() => setDraggingWords(false)}
            >
              <Slider
                value={[wordCount]}
                min={2}
                max={6}
                onValueChange={(val) => setWordCount(val[0])}
                aria-label="Words"
              />
              <div
                className="absolute -top-7 translate-x-[-50%] text-[10px] px-1.5 py-0.5 rounded bg-popover text-popover-foreground border shadow transition-all duration-150 ease-out"
                style={{ left: `${Math.min(100, Math.max(0, ((wordCount - 2) / (6 - 2)) * 100))}%` }}
                data-active={draggingWords ? 'true' : 'false'}
              >
                {wordCount}
              </div>
            </div>
            <span className="w-6 text-xs text-muted-foreground text-right">6</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs text-muted-foreground w-10 text-right cursor-default">{wordCount}</div>
                </TooltipTrigger>
                <TooltipContent>Words: {wordCount}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="includeCapitalization" checked={includeCapitalization} onCheckedChange={setIncludeCapitalization} />
          <label htmlFor="includeCapitalization" className="text-sm text-foreground">Capitalization</label>
        </div>
        </CardContent>
      </Card>
    )
  }

  if (activeTab === 'pin') {
    return (
      <Card>
        <CardHeader className="pb-1 pt-3 px-4">
          <CardTitle className="text-sm">PIN Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 px-4 pb-4">
        <label className="text-sm text-foreground">Digits</label>
        <div className="flex items-center gap-3">
          <span className="w-4 text-xs text-muted-foreground">4</span>
          <div className="relative flex-1 group"
            onMouseDown={() => setDraggingPin(true)}
            onMouseUp={() => setDraggingPin(false)}
            onMouseLeave={() => setDraggingPin(false)}
            onTouchStart={() => setDraggingPin(true)}
            onTouchEnd={() => setDraggingPin(false)}
          >
            <Slider
              value={[pinLength]}
              min={4}
              max={12}
              onValueChange={(val) => setPinLength(val[0])}
              aria-label="Digits"
            />
            <div
              className="absolute -top-7 translate-x-[-50%] text-[10px] px-1.5 py-0.5 rounded bg-popover text-popover-foreground border shadow transition-all duration-150 ease-out"
              style={{ left: `${Math.min(100, Math.max(0, ((pinLength - 4) / (12 - 4)) * 100))}%` }}
              data-active={draggingPin ? 'true' : 'false'}
            >
              {pinLength}
            </div>
          </div>
          <span className="w-6 text-xs text-muted-foreground text-right">12</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-muted-foreground w-10 text-right cursor-default">{pinLength}</div>
              </TooltipTrigger>
              <TooltipContent>Digits: {pinLength}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

export default PasswordControls
