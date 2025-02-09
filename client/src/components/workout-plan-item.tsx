import { useAuth } from '@/contexts/auth-context'
import { WorkoutPlanSummary } from '@/types/workout-plan'
import { ChevronRight, Dumbbell, User } from 'lucide-react'
import { Link } from 'react-router'

type WorkoutPlanItemProps = WorkoutPlanSummary

export function WorkoutPlanItem({ id, author, student, exercises, title }: WorkoutPlanItemProps) {
  const { user } = useAuth()

  return (
    <Link to={`/planilhas/${id}`}>
      <div
        className="bg-linear-to-r from-lime-300 to-lime-200 hover:bg-lime-300 dark:from-slate-950 dark:to-slate-950 dark:shadow-lime-800 dark:shadow-sm transition-colors duration-100 rounded-md px-3 h-24 flex items-center justify-between"
      >
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-300 mb-2 leading-tight">{title}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center space-x-1 leading-none">
              <Dumbbell size={16} />
              <span>{exercises} exercícios</span>
            </div>
            <div className="flex items-center space-x-1 leading-none">
              <User size={16} />
              <span className="text-sm">
                {
                user?.role === 'STUDENT'
                  ? author.split(' ')[0]
                  : student.split(' ')[0]
                }
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ChevronRight size={28} className="text-slate-700" />
        </div>
      </div>
    </Link>
  )
}
