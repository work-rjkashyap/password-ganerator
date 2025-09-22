import React, { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

/**
 * Modern combobox aligned with extension theme
 * props:
 * - value: current value
 * - onChange: (value) => void
 * - options: [{ value, label, preview }]
 * - placeholder
 * - className
 */
const Combobox = ({ value, onChange, options = [], placeholder = 'Select option', className = '' }) => {
  const [open, setOpen] = useState(false)
  const selected = options.find(option => option.value === value)
  const preview = selected?.preview?.trim()
  const description = selected?.description?.trim()

  const handleSelect = (nextValue) => {
    onChange(nextValue)
    setOpen(false)
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            type='button'
            aria-expanded={open}
            aria-label={selected ? selected.label : placeholder}
            className='w-full justify-between gap-2 px-3 py-1.5 text-left h-auto min-h-[36px]'
          >
            <div className='flex flex-1 flex-col items-start text-left'>
              <span className='text-sm font-medium leading-tight text-foreground'>
                {selected ? selected.label : placeholder}
              </span>
              <div className='mt-0.5 flex w-full flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground'>
                {selected ? (
                  <span className='max-w-full truncate'>{description || 'Symbols preset'}</span>
                ) : (
                  <span>Choose a symbol set</span>
                )}
              </div>
            </div>
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[260px] p-0'>
          <Command>
            <CommandInput placeholder='Search symbol sets...' />
            <CommandList>
              <CommandEmpty>No symbol sets found.</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const optionPreview = option.preview?.trim()
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className='flex items-start gap-2 py-2'
                    >
                      <div className='flex flex-1 flex-col text-left'>
                        <span className='text-sm font-medium leading-tight text-foreground'>{option.label}</span>
                        {option.description && (
                          <span className='mt-0.5 text-[11px] text-muted-foreground'>{option.description}</span>
                        )}
                        {optionPreview && option.description && (
                          <span className='mt-0.5 text-[10px] text-muted-foreground'>({optionPreview.length} symbols)</span>
                        )}
                      </div>
                      <Check className={cn('mt-0.5 h-4 w-4 text-primary opacity-0', option.value === value && 'opacity-100')} />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Combobox }
