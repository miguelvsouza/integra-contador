import { z } from "zod"

const envSchema = z.object({
  PORT: z.coerce.number(),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  CERT_PATH: z.string().url(),
  CERT_PASS: z.string(),
})

export const env = envSchema.parse(process.env)
