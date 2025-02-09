import { Link } from 'react-router'

import { LucideIcon } from '@/types/app'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface PersonalTrainerOptionProps {
  to: string
  title: string
  description?: string
  icon?: LucideIcon
  bannerUrl?: string
}

export function PersonalTrainerOption({
  to,
  title,
  description,
  bannerUrl,
  icon: Icon,
}: PersonalTrainerOptionProps) {
  return (
    <Link to={to} className="p-1 bg-slate-50 rounded-sm">
      <Button
        variant="outline"
        className={cn([
          'h-32 [&_svg]:size-8 hover:bg-lime-200 w-full relative z-10 shadow-none',
          bannerUrl && 'hover:bg-lime-200/80 z-10 lg:h-52',
        ])}
      >
        {bannerUrl && (
          <>
            <div
              className="absolute bg-gradient-to-l from-transparent to-slate-50 to-95% -z-10 w-full h-full rounded-sm"
            />
            <img
              src={bannerUrl}
              className="absolute w-full object-cover rounded-sm h-full -z-20"
            />
          </>

        )}
        <div className="flex w-full items-center justify-start gap-2">
          <div className="size-12 grid place-items-center">
            {Icon && (
              <Icon strokeWidth={1} />
            )}
          </div>
          <div className="text-left">
            <p className="font-display text-lg">{title}</p>
            <p className="text-xs opacity-70">
              {description}
            </p>
          </div>
        </div>
      </Button>
    </Link>
  )
}
