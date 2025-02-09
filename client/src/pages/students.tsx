import { CloudAlert, Ghost, Loader2, User2, Users2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { Header } from '@/components/header'
import { SecondaryContainer } from '@/components/secondary-container'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { RequestStatus } from '@/types/app'
import { Student } from '@/types/students'

export function Students() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('pending')
  const [students, setStudents] = useState<Student[]>([])

  async function fetchStudents() {
    setRequestStatus('pending')

    try {
      const response = await api.get('/students', {
        params: {
          query,
        },
      })

      setStudents(response.data.students)
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
    fetchStudents()
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
          <div className="leading-tight dark:text-orange-400">
            <h1 className="font-display font-semibold text-xl">Alunos</h1>
            <p className="text-sm opacity-70">Procure por alunos cadastrados</p>
          </div>
          <Users2 size={40} strokeWidth={1} className="dark:text-orange-400" />
        </div>
      </SecondaryContainer>
      <main className="flex flex-col gap-4 flex-1 items-center px-5">
        <Input placeholder="Nome ou email do aluno..." onChange={(evt) => onSearch(evt.currentTarget.value)} />
        {requestStatus === 'pending' && (
          <div className="my-auto">
            <Loader2 className="animate-spin text-lime-400" size={32} />
          </div>
        )}
        {requestStatus === 'failed' && (
          <div className="my-auto">
            <div className="flex flex-col items-center">
              <CloudAlert className="text-red-400" />
              <span className="text-red-400">Erro ao buscar alunos</span>
            </div>
          </div>
        )}
        {(requestStatus === 'success') && (
          <div className="w-full">
            <div className="space-y-3">
              <div className="w-full flex flex-col gap-4 mb-8">
                {students.map((item) => (
                  <div
                    key={`student-${item.id}`}
                    className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-800 shadow-xs rounded-lg py-3 px-2"
                  >
                    <div className="size-16 rounded-full grid place-items-center bg-lime-200 dark:bg-lime-300">
                      <User2 className="text-slate-500" strokeWidth={1} />
                    </div>
                    <div className="leading-tight">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs opacity-70">{item.email}</p>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <div className="w-full h-32 flex flex-col items-center justify-center gap-2 opacity-70">
                    <Ghost size={32} strokeWidth={1.3} />
                    <span className="text-center">Nenhum aluno encontrado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
