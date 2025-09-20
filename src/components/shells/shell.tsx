import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const shellVariants = cva("grid items-center gap-8 pb-8 pt-6 md:py-8", {
  variants: {
    variant: {
      default: "container",
      sidebar: "",
      centered: "container flex h-[100dvh] max-w-2xl flex-col justify-center",
      markdown: "container max-w-3xl gap-0 py-8 md:py-10 lg:py-10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface ShellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType
  children?: React.ReactNode
}

function Shell({
  className,
  as: Comp = "section",
  variant,
  children,
  ...props
}: ShellProps) {
  const Component = Comp as any
  return (
    <Component className={cn(shellVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  )
}

export { Shell, shellVariants }
