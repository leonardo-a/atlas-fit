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
import { SONNER_ERROR_STYLE } from '@/constants/sonner'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email('Deve ser um email válido'),
  password: z.string(),
})

export function SignInForm() {
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit({ email, password }: z.infer<typeof formSchema>) {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      })

      login(response.data.access_token)
    } catch (loginErr) {
      let message = 'Erro no login.'

      if (loginErr instanceof AxiosError) {
        const errorMessage = loginErr.status === 400
          ? 'Requisição inválida'
          : loginErr.status === 401
            ? 'Credenciais Inválidas'
            : message

        message = `[${loginErr.status}] ${errorMessage}`
      }

      toast(message, SONNER_ERROR_STYLE)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="usuario@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
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
            Enviar
          </Button>
        </div>
      </form>
    </Form>
  )
}
