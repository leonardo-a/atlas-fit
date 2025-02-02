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
import { Input } from '@/components/ui/input'
import { SONNER_ERROR_STYLE, SONNER_SUCCESS_STYLE } from '@/constants/sonner'
import { api } from '@/lib/axios'
import { Textarea } from './ui/textarea'

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Deve ter pelo menos 3 caracteres.',
  }),
  videoUrl: z.string()
    .transform((val) => (val === ''
      ? undefined
      : val))
    .optional()
    .refine((val) => val === undefined || z.string().url().safeParse(val).success, {
      message: 'Deve ser uma URL válida',
    }),
  description: z.string().optional(),
})

interface NewExerciseFormProps {
  onSuccess: () => void
}

export function NewExerciseForm({ onSuccess }: NewExerciseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      videoUrl: '',
      description: '',
    },
  })

  async function onSubmit({ name, videoUrl, description }: z.infer<typeof formSchema>) {
    try {
      const response = await api.post('/exercises', {
        name,
        videoUrl,
        description,
      })

      if (response.status === 201) {
        toast('Exercício criado!', SONNER_SUCCESS_STYLE)
        form.reset()
        onSuccess()
      }
    } catch (err) {
      let message = 'Erro ao criar exercício'

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nome dexercício" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vídeo</FormLabel>
              <FormControl>
                <Input placeholder="Link do vídeo (youtube)" {...field} />
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
                  placeholder="Descreva o exercício..."
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
