import { z } from 'zod'

export function getPayloadFromToken(token: string) {
  const payloadBase64 = token.split('.')[1]
  // const decodedPayload = atob(payloadBase64)
  const binary = Uint8Array.from(atob(payloadBase64), c => c.charCodeAt(0)) // Converte para Uint8Array
  const decodedPayload = new TextDecoder().decode(binary) // Decodifica como UTF-8
  const userData = JSON.parse(decodedPayload)

  const userDataSchema = z.object({
    iat: z.number(),
    sub: z.string().uuid(),
    name: z.string(),
    role: z.enum(['PERSONAL_TRAINER', 'ADMIN', 'STUDENT']),
  })

  return userDataSchema.parse(userData)
}
