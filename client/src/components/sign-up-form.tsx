import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
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
import { SONNER_ERROR_STYLE } from '@/constants/sonner'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string(),
  email: z.string().email('Deve ser um email válido'),
  password: z.string().min(6, 'Senha muito curta'),
  passwordConfirmation: z.string(),
})

export function SignUpForm() {
  const { login } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  async function onSubmit({ name, email, password, passwordConfirmation }: z.infer<typeof formSchema>) {
    if (password !== passwordConfirmation) {
      toast('Senhas não coincidem', { ...SONNER_ERROR_STYLE, position: 'top-center' })
      return
    }

    setIsProcessing(true)

    try {
      await api.post('/accounts', {
        name,
        email,
        password,
      })

      const response = await api.post('/sessions', {
        email,
        password,
      })

      login(response.data.access_token)
    } catch (loginErr) {
      setIsProcessing(false)

      let message = 'Erro no cadastro.'

      if (loginErr instanceof AxiosError) {
        const errorMessage = loginErr.status === 409
          ? 'Usuário já foi cadastrado'
          : 'Requisição inválida'

        message = `[${loginErr.status}] ${errorMessage}`
      }

      toast(message, { ...SONNER_ERROR_STYLE, position: 'top-center' })
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
              <FormLabel>Nome Completo <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Digite seu email..." type="email" {...field} />
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
              <FormLabel>Senha <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Crie uma senha" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha <span className="text-red-400">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Digite sua senha novamente" type="password" {...field} />
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
            className={cn(['w-full mt-4', isProcessing && 'opacity-60'])}
            disabled={isProcessing}
          >
            {isProcessing
              ? (<Loader2 className="animate-spin" />)
              : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
