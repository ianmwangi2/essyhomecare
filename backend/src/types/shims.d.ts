// Project-local shims.
// Keep this file *only* for `process.env` typing.
// Do NOT declare blanket modules like `express` / `cors`, otherwise it can break the real types.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string
      PORT?: string
      SUPABASE_URL?: string
      SUPABASE_SERVICE_KEY?: string
      FRONTEND_URL?: string
      RESEND_API_KEY?: string
    }
  }
}

export {}

