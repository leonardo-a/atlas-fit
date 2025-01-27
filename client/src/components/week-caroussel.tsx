import { addDays, format, setDefaultOptions, startOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"

setDefaultOptions({ locale: ptBR })

interface WeekCarouselProps {
  onWeekDayPress?: (weekDay: number) => void
}

export function WeekCarousel({onWeekDayPress}: WeekCarouselProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const [currentWeekDay, setCurrentWeekDay] = useState<number>(new Date().getDay() + 1)

  function handleClick(weekDay: number) {
    if(onWeekDayPress) {
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
    
      <div className="bg-slate-50 p-2 rounded-lg flex justify-between shadow-xs">
        {weekDays.map((day, index) => (
          <button
            key={index}
            className={`flex flex-col resize-none items-center p-2 rounded-full size-16 ${
              currentWeekDay === day.getDay() + 1 ? "bg-lime-200 text-slate-700" : "bg-slate-50 text-slate-500"
            }`}
            onClick={() => handleClick(day.getDay() + 1)}
          >
            <span className="text-xs font-semibold">{format(day, "EEEEEE")}</span>
            <span className="text-lg font-bold">{format(day, "d")}</span>
          </button>
        ))}
      </div>
  )
}

