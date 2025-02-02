import { ReactNode, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { RequestStatus } from '@/types/app'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { SONNER_ERROR_STYLE, SONNER_SUCCESS_STYLE } from '@/constants/sonner'
import { AxiosError } from 'axios'
import { useSearchParams } from 'react-router'

interface RemoveWorkoutPlanExerciseDialogProps {
  exercise: string
  workoutPlanExerciseId: string
  children?: ReactNode
  onSuccess?: () => void
}

export function RemoveWorkoutPlanExerciseDialog({
  exercise,
  workoutPlanExerciseId,
  children,
  onSuccess,
}: RemoveWorkoutPlanExerciseDialogProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')

  async function handleSubmit() {
    setRequestStatus('pending')

    try {
      const response = await api.delete(`/workout-plans/exercises/${workoutPlanExerciseId}`)

      setIsOpen(false)

      if (response.status === 204) {
        setRequestStatus('success')
        toast('Exercício removido da planilha!', SONNER_SUCCESS_STYLE)

        if (onSuccess) {
          onSuccess()
        }

        searchParams.set('upt', new Date().getTime().toString())
        setSearchParams(searchParams, { replace: true })
      } else {
        toast('Algo de errado ao remover exercício...', SONNER_ERROR_STYLE)
      }
    } catch (err) {
      setRequestStatus('failed')

      let message = 'Erro ao remover exercício'

      if (err instanceof AxiosError) {
        message = `[${err.status}] ${err.response?.data.message || message}`
      }

      toast(message, SONNER_ERROR_STYLE)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {children || (
          <Button variant="destructive" size="icon">
            <Trash2 />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm lg:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Remover <span className="font-bold text-red-400">{exercise}</span></DialogTitle>
          <DialogDescription className="text-red-400">
            Tem certeza? Essa ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center bg-slate-100 shadow-inner p-3 rounded-lg opacity-70">
          Você poderá registrar novamente caso necessário, mas perderá os dados de séries e repetições atuais
        </div>
        <DialogFooter className="flex flex-row justify-center gap-3">
          <Button
            variant="destructive"
            className="w-2/5"
            disabled={requestStatus === 'pending'}
            onClick={() => handleSubmit()}
          >
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
