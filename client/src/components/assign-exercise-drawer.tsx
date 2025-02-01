import { ListPlus } from 'lucide-react'

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
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { AssignExerciseForm } from './assign-exercise-form'

interface AssignExerciseDrawerProps {
  weekDay: number
  workoutPlanId: string
}

const weekDays: Record<number, string> = {
  1: 'domingo',
  2: 'segunda',
  3: 'terça',
  4: 'quarta',
  5: 'quinta',
  6: 'sexta',
  7: 'sábado',
}

export function AssignExerciseDrawer({ weekDay, workoutPlanId }: AssignExerciseDrawerProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [open, setOpen] = useState(false)

  function onSuccess() {
    setOpen(false)

    searchParams.set('upt', new Date().getTime().toString())
    setSearchParams(searchParams)
    // setTimeout(() => {
    //   navigate(0)
    // }, 800)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="success">
          <ListPlus />Adicionar Exercício
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Adicionar Exercício</DrawerTitle>
          <DrawerDescription>Registro um novo exercício para <span className="text-lime-400 font-bold">{weekDays[weekDay]}</span></DrawerDescription>
        </DrawerHeader>
        <div className="px-6">
          <AssignExerciseForm
            onSuccess={onSuccess}
            weekDay={weekDay}
            workoutPlanId={workoutPlanId}
          />
        </div>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>

  )
}
