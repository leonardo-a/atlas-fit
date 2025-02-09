import { cn } from '@/lib/utils'
import { addDays, format, setDefaultOptions, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useEffect, useState } from 'react'

setDefaultOptions({ locale: ptBR })

interface WeekCarouselProps {
  onWeekDayPress?: (weekDay: number) => void
  selectedWeekDay?: number
  size?: 'sm' | 'default'
}

export function WeekCarousel({ onWeekDayPress, selectedWeekDay, size }: WeekCarouselProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [currentWeekDay, setCurrentWeekDay] = useState<number>(
    selectedWeekDay || new Date().getDay() + 1,
  )

  function handleClick(weekDay: number) {
    if (onWeekDayPress) {
      setCurrentWeekDay(weekDay)

      onWeekDayPress(weekDay)
    }
  }

  useEffect(() => {
    const today = new Date()
    const startDate = startOfWeek(today, { weekStartsOn: 1 }) // Start on Monday
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
    setWeekDays(days)
  }, [])

  return (

    <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg flex justify-between shadow-xs">
      {weekDays.map((day, index) => (
        <button
          key={index}
          className={cn([
            'flex flex-col resize-none items-center justify-center p-2 rounded-xl h-16 w-16 text-slate-500',
            (currentWeekDay === day.getDay() + 1) && 'bg-lime-200 dark:bg-lime-300 text-slate-700 dark:text-slate-900',
            size === 'sm' && 'h-12 w-12',

          ])}
          onClick={() => handleClick(day.getDay() + 1)}
        >
          <span className="font-medium leading-none">{format(day, 'EEEEEE')}</span>
          <span className="text-xs font-light">{format(day, 'd')}</span>
        </button>
      ))}
    </div>
  )
}
