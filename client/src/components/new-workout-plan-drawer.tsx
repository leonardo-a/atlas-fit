import { ClipboardPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { NewWorkoutPlanForm } from './new-workout-plan-form'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export function NewWorkoutPlanDrawer() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function onSuccess() {
    setOpen(false)
    setTimeout(() => {
      navigate(0)
    }, 800)
  }

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerTrigger asChild>
        <Button size="lg" variant="success" onClick={() => setOpen(!open)}>
          <ClipboardPlus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nova planilha</DrawerTitle>
          <DrawerDescription>Crie uma planilha para um aluno</DrawerDescription>
        </DrawerHeader>
        <div className="px-6">
          <NewWorkoutPlanForm onSuccess={onSuccess} />
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>

  )
}
