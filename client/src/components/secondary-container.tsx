import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type SecondaryContainerProps = HTMLAttributes<HTMLDivElement>

export function SecondaryContainer({ className, children, ...props }: SecondaryContainerProps) {
  return (
    <div
      className={cn([
        'p-4 bg-linear-to-tr from-orange-200 to-orange-100 rounded-lg mx-4',
        className,
      ])}
      {...props}
    >
      {children}
    </div>
  )
}
