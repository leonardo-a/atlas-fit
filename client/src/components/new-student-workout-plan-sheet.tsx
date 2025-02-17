import { ClipboardPlus } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router'

import { NewStudentWorkoutPlanForm } from './new-student-workout-plan-form'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

interface NewStudentWorkoutPlanSheetProps {
  children?: ReactNode
  studentId: string
  studentName: string
}

export function NewStudentWorkoutPlanSheet({
  children,
  studentName,
  studentId,
}: NewStudentWorkoutPlanSheetProps) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  function onSuccess() {
    setIsOpen(false)
    navigate(0)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button size="lg" variant="success" onClick={() => setIsOpen(true)}>
            <ClipboardPlus />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nova planilha</SheetTitle>
          <SheetDescription>
            Crie uma planilha para <span className="font-bold text-lime-500">{studentName}</span>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <NewStudentWorkoutPlanForm
            studentId={studentId}
            onSuccess={onSuccess}
          />
        </div>

      </SheetContent>
    </Sheet>

  )
}
