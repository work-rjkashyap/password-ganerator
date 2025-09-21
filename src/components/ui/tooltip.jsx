"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

function cn(...classes){return classes.filter(Boolean).join(' ')}

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

