import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "cr-badge",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
        secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        destructive: "cr-badge-rejected",
        outline: "border-slate-200 text-slate-900 dark:border-slate-800 dark:text-slate-100",
        progress: "cr-badge-progress",
        pending: "cr-badge-pending",
        resolved: "cr-badge-resolved",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
