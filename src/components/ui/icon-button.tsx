import * as React from "react"

import { cn } from "@/lib/utils"

export interface IconBoxProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const IconButton = React.forwardRef<HTMLButtonElement, IconBoxProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "bg-accent w-8 h-8 rounded-full hover:bg-gray-200 grid place-items-center",
          className
        )}
        ref={ref}
        {...props}
      >{props.children}</button>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton }
