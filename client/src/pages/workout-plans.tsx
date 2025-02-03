import { ClipboardList, ClipboardPlus, CloudAlert, Ghost, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Header } from '@/components/header'
import { SecondaryContainer } from '@/components/secondary-container'
import { Input } from '@/components/ui/input'
import { WorkoutPlanItem } from '@/components/workout-plan-item'
import { api } from '@/lib/axios'
import { RequestStatus } from '@/types/app'
import { WorkoutPlanSummary } from '@/types/workout-plan'
import { NewWorkoutPlanSheet } from '@/components/new-workout-plan-sheet'
import { Button } from '@/components/ui/button'

export function WorkoutPlans() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState(() => {
    const currentQuery = searchParams.get('q')

    if (currentQuery) {
      return currentQuery
    }

    return ''
  })
  const [workoutPlansStatus, setWorkoutPlansStatus] = useState<RequestStatus>('pending')
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanSummary[]>([])

  async function fetchWorkoutPlans() {
    setWorkoutPlansStatus('pending')

    try {
      const workoutPlans = await api.get('/workout-plans', {
        params: {
          query,
        },
      })

      setWorkoutPlans(workoutPlans.data.workoutPlans)
      setWorkoutPlansStatus('success')
    } catch (err) {
      setWorkoutPlansStatus('failed')
      console.log(err)
    }
  }

  function onSearch(value: string) {
    searchParams.set('q', value)
    setSearchParams(searchParams, { replace: true })

    setQuery(value)
  }

  useEffect(() => {
    fetchWorkoutPlans()
  }, [query])

  return (
    <>
      <Header />
      <SecondaryContainer className="mt-16 h-32 mb-4">
        <div className="flex justify-between items-center h-full">
          <div className="leading-tight">
            <h1 className="font-display font-semibold text-xl">Minhas Planilhas</h1>
            <p className="text-sm opacity-70">Gerencia suas planilhas de treino</p>
          </div>
          <ClipboardList size={40} strokeWidth={1} />
        </div>
      </SecondaryContainer>
      <main className="flex flex-col gap-4 flex-1 items-center bg-slate-100 px-5">
        <div className="flex items-center gap-2 w-full">

          <Input className="flex-1" placeholder="Busque por planilhas..." onChange={(evt) => onSearch(evt.currentTarget.value)} />

        </div>
        {workoutPlansStatus === 'pending' && (
          <div className="my-auto">
            <Loader2 className="animate-spin text-lime-400" size={32} />
          </div>
        )}
        {workoutPlansStatus === 'failed' && (
          <div className="my-auto">
            <div className="flex flex-col items-center">
              <CloudAlert className="text-red-400" />
              <span className="text-red-400">Erro ao buscar planilhas</span>
            </div>
          </div>
        )}
        {(workoutPlansStatus === 'success') && (
          <div className="w-full">
            <div className="space-y-3">
              <div className="w-full flex flex-col gap-4 mb-20">
                {workoutPlans.map((item) => (
                  <WorkoutPlanItem key={item.slug} {...item} />
                ))}
                {workoutPlans.length === 0 && (
                  <div className="w-full h-32 flex flex-col items-center justify-center gap-2 opacity-70">
                    <Ghost size={32} strokeWidth={1.3} />
                    <span className="text-center">Nenhuma planilha encontrado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="h-16 px-4 bg-slate-50 right-0 fixed bottom-0 grid place-items-center rounded-tl-xl shadow-xs">
          <NewWorkoutPlanSheet>
            <Button variant="success" className="lg:text-xl" size="lg">
              <ClipboardPlus /> Criar Planilha
            </Button>
          </NewWorkoutPlanSheet>
        </div>
      </main>
    </>
  )
}
