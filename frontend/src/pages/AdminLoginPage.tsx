import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
        return
      }

      const role = data?.user?.user_metadata?.role || data?.user?.app_metadata?.role
      if (data?.user && role !== 'admin') {
        setError('Admin access is required for this portal.')
        await supabase.auth.signOut()
        return
      }

      if (data?.user) {
        navigate('/admin')
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResetMessage('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail)

      if (resetError) {
        setError(resetError.message)
        return
      }

      setResetMessage('Password reset email sent. Check your inbox.')
    } catch (err: any) {
      setError('An unexpected error occurred while sending reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/essy-logo.svg"
            alt="Essy Homecare logo"
            className="mx-auto mb-4 h-12 sm:h-14 md:h-16 w-auto object-contain"
          />
          <h1 className="text-2xl font-heading font-bold text-primary">
            Essy Admin Portal
          </h1>
          <p className="text-text-muted text-sm mt-2">
            CHAP-Accredited Home Healthcare
          </p>
        </div>

        {/* Form */}
        {forgotMode ? (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {resetMessage && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                {resetMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@essyhomecare.com"
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending reset email...' : 'Send reset email'}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotMode(false)
                setError('')
                setResetMessage('')
              }}
              className="w-full btn-outline"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@essyhomecare.com"
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setForgotMode(true)
                  setError('')
                  setResetEmail(email)
                }}
                className="text-green hover:text-orange transition-colors font-semibold text-sm"
              >
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-light-gray text-center text-sm text-text-muted">
          <p>Having trouble logging in?</p>
          <a href="mailto:info@essyhomecare.com" className="text-green hover:text-orange transition-colors font-semibold">
            Contact support
          </a>
        </div>
      </div>
    </div>
  )
}
