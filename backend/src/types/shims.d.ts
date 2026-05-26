// Minimal shims to satisfy TypeScript during CI when @types/* may not be installed
declare module 'express'
declare module 'cors'
declare module 'multer'

// Ensure `process` name is available during builds without @types/node
declare var process: NodeJS.Process;

// Augment Express Request with commonly used properties to avoid TS errors
declare namespace Express {
  interface Request {
    body?: any
    params?: any
    headers?: Record<string, any>
  }
}

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
