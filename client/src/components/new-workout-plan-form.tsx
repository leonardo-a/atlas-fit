import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
import { SONNER_ERROR_STYLE, SONNER_SUCCESS_STYLE } from '@/constants/sonner'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
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

export function NewWorkoutPlanForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      studentId: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit({ studentId, title, description }: z.infer<typeof formSchema>) {
    try {
      const response = await api.post('/workout-plans', {
        title,
        studentId,
        description,
      })

      if (response.status === 201) {
        toast('Planilha criada!', SONNER_SUCCESS_STYLE)
      }
    } catch (err) {
      let message = 'Erro ao criar planilha'

      if (err instanceof AxiosError) {
        message = `[${err.status}] ${err.response?.data.message || message}`
      }

      toast(message, SONNER_ERROR_STYLE)
    }
  }

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
            <FormItem>
              <FormLabel>Aluno <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="id do aluno" {...field} />
              </FormControl>
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
