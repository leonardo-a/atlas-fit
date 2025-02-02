import { SquarePen } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { Exercise } from '@/types/exercises'
import { EditExerciseForm } from './edit-exercise-form'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

interface EditExerciseSheetProps {
  exercise: Exercise
  children?: ReactNode
}

export function EditExerciseSheet({ exercise, children }: EditExerciseSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  function onSuccess() {
    setIsOpen(false)

    window.location.replace(window.location.href)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        {children || (
          <Button size="lg" variant="success" onClick={() => setIsOpen(true)}>
            <SquarePen />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Novo exercício</SheetTitle>
          <SheetDescription>
            Registre um novo exercício no sistema
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <EditExerciseForm exercise={exercise} onSuccess={onSuccess} />
        </div>

      </SheetContent>
    </Sheet>

  )
}
