import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { SONNER_ERROR_STYLE, SONNER_SUCCESS_STYLE } from '@/constants/sonner'
import { api } from '@/lib/axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Exercise } from '@/types/exercises'

const formSchema = z.object({
  exerciseId: z.string().uuid({
    message: 'Deve ter pelo menos 3 caracteres.',
  }),
  repetitions: z.coerce.number().int().positive().min(1, {
    message: 'Repetição não pode ser menor que 1',
  }),
  sets: z.coerce.number().int().positive().min(1, {
    message: 'Séries não pode ser menor que 1',
  }),
})

interface AssignExerciseFormProps {
  workoutPlanId: string
  weekDay: number
  onSuccess: () => void
}

export function AssignExerciseForm({ weekDay, workoutPlanId, onSuccess }: AssignExerciseFormProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [queryExercises, setQueryExercises] = useState<string | undefined>()

  async function fetchExercises(query?: string) {
    try {
      const response = await api.get('/exercises', {
        params: {
          query,
        },
      })

      setExercises(response.data.exercises)
    } catch (err) {
      console.log(err)
      toast('Falha ao buscar exercicios', SONNER_ERROR_STYLE)
    }
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exerciseId: '',
      repetitions: 0,
      sets: 0,
    },
  })

  // 2. Define a submit handler.
  async function onSubmit({ exerciseId, repetitions, sets }: z.infer<typeof formSchema>) {
    try {
      const response = await api.post(`/workout-plans/${workoutPlanId}/exercises`, {
        exerciseId,
        repetitions,
        sets,
        weekDay,
      })

      if (response.status === 201) {
        toast('Exercício registrado!', { ...SONNER_SUCCESS_STYLE, position: 'top-center' })
        onSuccess()
      }
    } catch (err) {
      let message = 'Erro ao registrar exercício'

      if (err instanceof AxiosError) {
        message = `[${err.status}] ${err.response?.data.message || message}`
      }

      toast(message, { ...SONNER_ERROR_STYLE, position: 'top-center' })
    }
  }

  useEffect(() => {
    fetchExercises(queryExercises)
  }, [queryExercises])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="exerciseId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Exercício</FormLabel>
              <Popover>
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
                        ? exercises.find(
                          (exercise) => exercise.id === field.value,
                        )?.name
                        : 'Selecione o exercício'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Procure um exercício..."
                      className="h-9"
                      onValueChange={setQueryExercises}
                    />
                    <CommandList>
                      <CommandEmpty>Nenhum exercício encontrado.</CommandEmpty>
                      <CommandGroup>
                        {exercises.map((exercise) => (
                          <CommandItem
                            value={exercise.name}
                            key={exercise.id}
                            onSelect={() => {
                              form.setValue('exerciseId', exercise.id)
                            }}
                          >
                            {exercise.name}
                            <Check
                              className={cn(
                                'ml-auto',
                                exercise.id === field.value
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
          name="sets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Séries <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input type="number" placeholder="Número de séries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repetitions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetições <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input type="number" placeholder="Repetiçoes por série" {...field} />
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
