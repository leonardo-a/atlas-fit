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

export function NewWorkoutPlanDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="lg" variant="success">
          <ClipboardPlus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nova planilha</DrawerTitle>
          <DrawerDescription>Crie uma planilha para um aluno</DrawerDescription>
        </DrawerHeader>
        <div className="px-6">
          <NewWorkoutPlanForm />
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>

  )
}
