// Minimal shims to satisfy TypeScript for environment variables during CI
// Avoid broad module shims that conflict with @types/express/@types/cors

// Ensure `process` name is available during builds
declare var process: NodeJS.Process;

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
