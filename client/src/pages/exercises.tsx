import { BookPlus, CloudAlert, Dumbbell, Ghost, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { EditExerciseSheet } from '@/components/edit-exercise-sheet'
import { Header } from '@/components/header'
import { SecondaryContainer } from '@/components/secondary-container'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { RequestStatus } from '@/types/app'
import { Exercise } from '@/types/exercises'
import { NewExerciseSheet } from '@/components/new-exercise-sheet'
import { Button } from '@/components/ui/button'

export function Exercises() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('pending')
  const [exercises, setExercises] = useState<Exercise[]>([])

  async function fetchExercises() {
    setRequestStatus('pending')

    try {
      const response = await api.get('/exercises', {
        params: {
          query,
        },
      })

      setExercises(response.data.exercises)
      setRequestStatus('success')
    } catch (err) {
      setRequestStatus('failed')
      console.log(err)
    }
  }

  function onSearch(value: string) {
    searchParams.set('q', value)
    setSearchParams(searchParams, { replace: true })

    setQuery(value)
  }

  useEffect(() => {
    fetchExercises()
  }, [query])

  if (user?.role === 'STUDENT') {
    navigate('/')
    return
  }

  return (
    <>
      <Header />
      <SecondaryContainer className="mt-16 h-32 mb-4">
        <div className="flex justify-between items-center h-full">
          <div className="leading-tight">
            <h1 className="font-display font-semibold text-xl">Exercícios</h1>
            <p className="text-sm opacity-70">Gerencie os exercícios cadastrados</p>
          </div>
          <Dumbbell size={40} strokeWidth={1} />
        </div>
      </SecondaryContainer>
      <main className="flex flex-col gap-4 flex-1 items-center bg-slate-100 px-5">
        <Input placeholder="Busque pelo nome do exercício..." onChange={(evt) => onSearch(evt.currentTarget.value)} />
        {requestStatus === 'pending' && (
          <div className="my-auto">
            <Loader2 className="animate-spin text-lime-400" size={32} />
          </div>
        )}
        {requestStatus === 'failed' && (
          <div className="my-auto">
            <div className="flex flex-col items-center">
              <CloudAlert className="text-red-400" />
              <span className="text-red-400">Erro ao buscar exercícios</span>
            </div>
          </div>
        )}
        {(requestStatus === 'success') && (
          <div className="w-full">
            <div className="space-y-3">
              <div className="w-full flex flex-col gap-4 mb-20">
                {exercises.map((item) => (
                  <div
                    key={`exercise-${item.id}`}
                    className="w-full flex items-center gap-2 bg-slate-50 shadow-xs rounded-lg py-3 px-2"
                  >
                    <div className="size-16 grid place-items-center">
                      <Dumbbell />
                    </div>
                    <div className="leading-tight flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs opacity-70">
                        {
                          item.description?.substring(0, 60).concat(
                            item.description.length > 60
                              ? '...'
                              : '',
                          )
                        }
                      </p>
                    </div>
                    <EditExerciseSheet exercise={item} />
                  </div>
                ))}
                {exercises.length === 0 && (
                  <div className="w-full h-32 flex flex-col items-center justify-center gap-2 opacity-70">
                    <Ghost size={32} strokeWidth={1.3} />
                    <span className="text-center">Nenhum exercício encontrado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="h-16 px-4 bg-slate-50 right-0 fixed bottom-0 grid place-items-center rounded-tl-xl shadow-xs">
          <NewExerciseSheet>
            <Button variant="success" className="lg:text-xl" size="lg">
              <BookPlus /> Registrar Exercício
            </Button>
          </NewExerciseSheet>
        </div>
      </main>
    </>
  )
}
