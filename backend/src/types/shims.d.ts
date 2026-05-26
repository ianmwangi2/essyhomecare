// Minimal shims to satisfy TypeScript during CI when @types/* may not be installed
declare module 'express'
declare module 'cors'
declare module 'multer'

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
