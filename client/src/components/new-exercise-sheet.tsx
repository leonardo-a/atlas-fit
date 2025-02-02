import { BookPlus } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { NewExerciseForm } from './new-exercise-form'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

interface NewExerciseSheetProps {
  children?: ReactNode
}

export function NewExerciseSheet({ children }: NewExerciseSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  function onSuccess() {
    // setIsOpen(false)
    // navigate(0)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        {children || (
          <Button size="lg" variant="success" onClick={() => setIsOpen(true)}>
            <BookPlus />
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
          <NewExerciseForm onSuccess={onSuccess} />
        </div>

      </SheetContent>
    </Sheet>

  )
}
