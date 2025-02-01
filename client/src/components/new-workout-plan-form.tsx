import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SONNER_ERROR_STYLE, SONNER_SUCCESS_STYLE } from '@/constants/sonner'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { Student } from '@/types/students'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  title: z.string().min(3, {
    message: 'Deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().optional(),
  studentId: z.string().uuid({
    message: 'Formato inválido',
  }),
})

interface NewWorkoutPlanFormProps {
  onSuccess: () => void
}

export function NewWorkoutPlanForm({ onSuccess }: NewWorkoutPlanFormProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [isStudentsSelectorOpen, setIsStudentsSelectorOpen] = useState(false)
  const [queryStudents, setQueryStudents] = useState<string | undefined>()

  async function fetchStudents(query?: string) {
    try {
      const response = await api.get('/students', {
        params: {
          query,
        },
      })

      console.log(response.data.students)

      setStudents(response.data.students)
    } catch (err) {
      console.log(err)
      toast('Falha ao buscar alunos', SONNER_ERROR_STYLE)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      studentId: '',
    },
  })

  async function onSubmit({ studentId, title, description }: z.infer<typeof formSchema>) {
    try {
      const response = await api.post('/workout-plans', {
        title,
        studentId,
        description,
      })

      if (response.status === 201) {
        toast('Planilha criada!', SONNER_SUCCESS_STYLE)
        form.reset()
        onSuccess()
      }
    } catch (err) {
      let message = 'Erro ao criar planilha'

      if (err instanceof AxiosError) {
        message = `[${err.status}] ${err.response?.data.message || message}`
      }

      toast(message, SONNER_ERROR_STYLE)
    }
  }

  useEffect(() => {
    fetchStudents(queryStudents)
  }, [queryStudents])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nome da planilha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Aluno <span className="text-red-400">*</span></FormLabel>
              <Popover open={isStudentsSelectorOpen} onOpenChange={setIsStudentsSelectorOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? students.find(
                          (student) => student.id === field.value,
                        )?.name
                        : 'Selecione um aluno'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Procure um aluno..."
                      className="h-9"
                      onValueChange={setQueryStudents}
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
                      <CommandGroup>
                        {students.map((student: Student) => (
                          <CommandItem
                            value={student.name}
                            key={student.id}
                            onSelect={() => {
                              setIsStudentsSelectorOpen(false)
                              form.setValue('studentId', student.id)
                            }}
                          >
                            <div className="leading-none">
                              <p>{student.name}</p>
                              <p className="text-xs opacity-45">{student.email}</p>

                            </div>
                            <Check
                              className={cn(
                                'ml-auto text-lime-600',
                                student.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o objetivo dessa planilha"
                  className="resize-none"
                  rows={3} {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button
            size="lg"
            type="submit"
            variant="success"
            className="w-36"
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
