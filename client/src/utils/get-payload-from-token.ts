import { z } from "zod"

export function getPayloadFromToken(token: string) {
  const payloadBase64 = token.split(".")[1]
  const decodedPayload = atob(payloadBase64)
  const userData = JSON.parse(decodedPayload)

  const userDataSchema = z.object({
    iat: z.number(),
    sub: z.string().uuid(),
    role: z.enum(['PERSONAL_TRAINER', 'ADMIN', 'STUDENT'])
  })

  return userDataSchema.parse(userData)
}