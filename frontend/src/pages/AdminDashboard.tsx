import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import apiClient from '@/lib/api'

interface Referral {
  id: string
  patient_first_name: string
  patient_last_name: string
  phone: string
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<{
    referrals_this_week: number
    referrals_this_month: number
    total_referrals: number
    total_applications: number
    status_breakdown: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: userData }, { data: statsData }, { data: referralsData }] = await Promise.all([
          supabase.auth.getUser(),
          apiClient.get('/api/admin/stats'),
          apiClient.get('/api/referrals')
        ])

        setUser(userData.user)
        setStats(statsData)
        setReferrals(referralsData || [])
      } catch (err: any) {
        console.error('Error loading admin dashboard:', err)
        setError(err?.response?.data?.error || 'Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
      </div>
    )
  }

  return (
    <div className="bg-light-gray min-h-screen">
      {/* Admin Header */}
      <div className="bg-primary text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6 border-t-4 border-green">
            <p className="text-text-muted text-sm">New Referrals</p>
            <p className="text-3xl font-bold text-green">{stats?.referrals_this_week ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-orange">
            <p className="text-text-muted text-sm">In Review</p>
            <p className="text-3xl font-bold text-orange">{stats?.status_breakdown?.in_review ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-teal">
            <p className="text-text-muted text-sm">Admitted</p>
            <p className="text-3xl font-bold text-teal">{stats?.status_breakdown?.admitted ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-primary">
            <p className="text-text-muted text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-primary">{stats?.total_applications ?? 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-6">
          <h2 className="font-heading font-bold text-xl mb-4">Recent Referrals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-light-gray">
                  <th className="px-4 py-2 text-left font-semibold text-primary">Patient Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-primary">Phone</th>
                  <th className="px-4 py-2 text-left font-semibold text-primary">Status</th>
                  <th className="px-4 py-2 text-left font-semibold text-primary">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length > 0 ? (
                  referrals.map((ref) => (
                    <tr key={ref.id} className="border-b border-light-gray hover:bg-light-gray transition-colors">
                      <td className="px-4 py-3">{ref.patient_first_name} {ref.patient_last_name}</td>
                      <td className="px-4 py-3">{ref.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${ref.status === 'new' ? 'green' : ref.status === 'admitted' ? 'teal' : 'orange'}/10 text-${ref.status === 'new' ? 'green' : ref.status === 'admitted' ? 'teal' : 'orange'}`}>
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{new Date(ref.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button className="text-green hover:text-orange transition-colors font-semibold">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      No referrals yet. Data will appear here once referrals are submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
