import { User2 } from 'lucide-react'

import { Student } from '@/types/students'
import { NewStudentWorkoutPlanSheet } from './new-student-workout-plan-sheet'

type StudentItemProps = Student

export function StudentItem({
  id,
  email,
  name,
}: StudentItemProps) {
  return (
    <div
      className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-800 shadow-xs rounded-lg py-3 px-2"
    >
      <div className="size-16 rounded-full grid place-items-center bg-lime-200 dark:bg-lime-300">
        <User2 className="text-slate-500" strokeWidth={1} />
      </div>
      <div className="leading-tight flex-1">
        <p className="font-bold">{name}</p>
        <p className="text-xs opacity-70">{email}</p>
      </div>
      <NewStudentWorkoutPlanSheet
        studentId={id}
        studentName={name}
      />
    </div>
  )
}
