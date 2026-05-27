import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/admin-login')
        return
      }

      // Verify admin role
      const role = session.user?.user_metadata?.role || session.user?.app_metadata?.role
      if (role !== 'admin') {
        console.warn('Non-admin user attempted to access admin panel')
        await supabase.auth.signOut()
        navigate('/admin-login')
        return
      }

      setIsAuthenticated(true)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setIsAuthenticated(false)
        navigate('/admin-login')
      } else {
        // Verify admin role on every auth change
        const role = session.user?.user_metadata?.role || session.user?.app_metadata?.role
        if (role !== 'admin') {
          setIsAuthenticated(false)
          supabase.auth.signOut()
          navigate('/admin-login')
        } else {
          setIsAuthenticated(true)
        }
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [navigate])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
