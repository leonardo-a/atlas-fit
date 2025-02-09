import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface SecondaryContainerProps extends HTMLAttributes<HTMLDivElement> {
  bannerUrl?: string
}

export function SecondaryContainer({ className, children, bannerUrl, ...props }: SecondaryContainerProps) {
  return (
    <div
      className={cn([
        'p-4 rounded-lg mx-4 relative z-10 bg-orange-200 dark:bg-slate-800 dark:border dark:border-lime-300',
        className,
      ])}
      {...props}
    >
      {bannerUrl && (
        <div className="absolute h-full object-cover w-full -z-10 bottom-0 left-0 rounded-lg p-2">
          <img
            src={bannerUrl}
            className="object-cover h-full w-full rounded-lg"
          />
        </div>
      )}
      {children}
    </div>
  )
}
