import { ClipboardPlus } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { SONNER_SUCCESS_STYLE } from '@/constants/sonner'
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
  const [isOpen, setIsOpen] = useState(false)

  function onSuccess() {
    setIsOpen(false)

    toast('Planilha criada!', SONNER_SUCCESS_STYLE)
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
