import { ClipboardPlus } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ReactNode, useState } from 'react'
import { NewWorkoutPlanForm } from './new-workout-plan-form'
import { useNavigate } from 'react-router'

interface NewWorkoutPlanSheetProps {
  children?: ReactNode
}

export function NewWorkoutPlanSheet({ children }: NewWorkoutPlanSheetProps) {
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
            Crie uma planilha para um aluno
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <NewWorkoutPlanForm onSuccess={onSuccess} />
        </div>

      </SheetContent>
    </Sheet>

  )
}
