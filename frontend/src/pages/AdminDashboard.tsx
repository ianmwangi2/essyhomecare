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
  nurse_name?: string
  source?: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  created_at: string
}

interface Application {
  id: string
  applicant_name: string
  email: string
  phone: string
  resume_url?: string
  status?: string
  created_at: string
}

const statusStyles: Record<string, string> = {
  new: 'bg-green/10 text-green',
  in_review: 'bg-amber/10 text-amber',
  review: 'bg-amber/10 text-amber',
  approved: 'bg-teal/10 text-teal',
  admitted: 'bg-sky/10 text-sky',
  rejected: 'bg-red/10 text-red',
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

const downloadCsv = (filename: string, rows: string) => {
  const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'referrals' | 'contacts' | 'applications'>('referrals')
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<{
    referrals_this_week: number
    referrals_this_month: number
    total_referrals: number
    total_applications: number
    total_contacts: number
    total_jobs: number
    status_breakdown: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDetail, setSelectedDetail] = useState<Referral | Contact | Application | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const refreshDashboard = async (showLoading = false) => {
    if (showLoading) setLoading(true)
    try {
      const [userResult, statsResult, referralResult, contactResult, applicationResult] = await Promise.all([
        supabase.auth.getUser(),
        apiClient.get('/api/admin/stats'),
        apiClient.get('/api/admin/referrals'),
        apiClient.get('/api/admin/contacts'),
        apiClient.get('/api/admin/applications'),
      ])

      setUser(userResult.data.user)
      setStats(statsResult.data)
      setReferrals(referralResult.data || [])
      setContacts(contactResult.data || [])
      setApplications(applicationResult.data || [])
    } catch (err: any) {
      console.error('Error loading admin dashboard:', err)
      setError(err?.response?.data?.error || 'Unable to load dashboard data')
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    refreshDashboard(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleAction = async (
    action: 'approve' | 'reject',
    item: Referral | Application,
    type: 'referral' | 'application',
  ) => {
    setActionMessage('')
    setActionLoading(true)

    try {
      const reason = action === 'reject'
        ? window.prompt('Reason for rejection?', 'Rejected by admin')
        : undefined

      const payload = reason ? { reason } : {}
      const response = await apiClient.post(`/api/admin/${type}s/${item.id}/${action}`, payload)

      setActionMessage(response.data?.message || `${type.charAt(0).toUpperCase() + type.slice(1)} ${action}d successfully.`)
      await refreshDashboard()
      setSelectedDetail((current) => current ? ({ ...current, status: action === 'approve' ? 'approved' : 'rejected' } as Referral | Application) : current)
    } catch (err: any) {
      setActionMessage(err?.response?.data?.error || 'Unable to complete action.')
    } finally {
      setActionLoading(false)
    }
  }

  const filteredReferrals = referrals.filter((referral) => {
    const query = `${referral.patient_first_name} ${referral.patient_last_name} ${referral.phone} ${referral.source ?? ''}`.toLowerCase()
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter
    return query.includes(searchTerm.toLowerCase()) && matchesStatus
  })

  const exportReferralsCsv = () => {
    const rows = [
      ['Patient First Name', 'Patient Last Name', 'Phone', 'Status', 'Source', 'Date'],
      ...filteredReferrals.map((ref) => [
        ref.patient_first_name,
        ref.patient_last_name,
        ref.phone,
        ref.status,
        ref.source || '',
        formatDate(ref.created_at),
      ]),
    ]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    downloadCsv('referrals-export.csv', rows)
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
      <div className="bg-primary text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-sm text-teal mt-1">Signed in as {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card p-6 border-t-4 border-green">
            <p className="text-text-muted text-sm">New Referrals</p>
            <p className="text-3xl font-bold text-green">{stats?.referrals_this_week ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-orange">
            <p className="text-text-muted text-sm">In Review</p>
            <p className="text-3xl font-bold text-orange">{stats?.status_breakdown?.review ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-sky">
            <p className="text-text-muted text-sm">Admitted</p>
            <p className="text-3xl font-bold text-sky">{stats?.status_breakdown?.admitted ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-primary">
            <p className="text-text-muted text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-primary">{stats?.total_applications ?? 0}</p>
          </div>
          <div className="card p-6 border-t-4 border-teal">
            <p className="text-text-muted text-sm">Total Contacts</p>
            <p className="text-3xl font-bold text-teal">{stats?.total_contacts ?? 0}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 rounded-full bg-white shadow-sm border border-light-gray overflow-hidden">
            {['referrals', 'contacts', 'applications'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as 'referrals' | 'contacts' | 'applications')
                  setSelectedDetail(null)
                }}
                className={`px-5 py-3 text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-text-muted hover:bg-light-gray'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {activeTab === 'referrals' && (
            <button
              type="button"
              onClick={exportReferralsCsv}
              className="btn-secondary"
            >
              Export Referrals CSV
            </button>
          )}
        </div>

        {activeTab === 'referrals' && (
          <div className="card p-6 mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <div className="grid gap-4 md:grid-cols-2 flex-1">
                <label className="block">
                  <span className="text-sm font-semibold text-text-muted">Search referrals</span>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name, phone, or source"
                    className="mt-2 w-full rounded-lg border border-light-gray p-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-text-muted">Filter status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-light-gray p-3"
                  >
                    <option value="all">All statuses</option>
                    <option value="new">New</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="admitted">Admitted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
              </div>
              <p className="text-sm text-text-muted">Showing {filteredReferrals.length} of {referrals.length} referrals</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-light-gray text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Patient</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Phone</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Submitted</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.length > 0 ? (
                    filteredReferrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-light-gray hover:bg-light-gray transition-colors">
                        <td className="px-4 py-3">{ref.patient_first_name} {ref.patient_last_name}</td>
                        <td className="px-4 py-3">{ref.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[ref.status] ?? 'bg-slate/10 text-slate'}`}>
                            {ref.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(ref.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedDetail(ref)}
                            className="text-primary hover:text-teal font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                        No referrals match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="card p-6 mb-6">
            <h3 className="font-heading font-bold text-lg mb-4">Contacts</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-light-gray text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Name</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Created</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-light-gray hover:bg-light-gray transition-colors">
                        <td className="px-4 py-3">{contact.name}</td>
                        <td className="px-4 py-3">{contact.email}</td>
                        <td className="px-4 py-3">{formatDate(contact.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedDetail(contact)}
                            className="text-primary hover:text-teal font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                        No contact requests have been submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="card p-6 mb-6">
            <h3 className="font-heading font-bold text-lg mb-4">Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-light-gray text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Applicant</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Submitted</th>
                    <th className="px-4 py-3 text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((application) => (
                      <tr key={application.id} className="border-b border-light-gray hover:bg-light-gray transition-colors">
                        <td className="px-4 py-3">{application.applicant_name}</td>
                        <td className="px-4 py-3">{application.email}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-slate/10 px-3 py-1 text-sm font-semibold text-slate">
                            {application.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(application.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedDetail(application)}
                            className="text-primary hover:text-teal font-semibold"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                        No applications have been received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 shadow-xl">
            <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
              <div className="flex flex-col gap-4 border-b border-light-gray px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl">Details</h3>
                  <p className="text-sm text-text-muted">Review the selected item and take administrative actions.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDetail(null)}
                    className="rounded-lg border border-light-gray bg-white px-4 py-2 text-sm text-text-muted hover:border-slate hover:text-slate"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {activeTab === 'referrals' && (
                    <>
                      <div>
                        <p className="text-sm text-text-muted">Patient</p>
                        <p className="font-semibold">{(selectedDetail as Referral).patient_first_name} {(selectedDetail as Referral).patient_last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Phone</p>
                        <p className="font-semibold">{(selectedDetail as Referral).phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Status</p>
                        <p className="font-semibold">{(selectedDetail as Referral).status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Submitted</p>
                        <p className="font-semibold">{formatDate((selectedDetail as Referral).created_at)}</p>
                      </div>
                      {(selectedDetail as Referral).source && (
                        <div>
                          <p className="text-sm text-text-muted">Source</p>
                          <p className="font-semibold">{(selectedDetail as Referral).source}</p>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'contacts' && (
                    <>
                      <div>
                        <p className="text-sm text-text-muted">Name</p>
                        <p className="font-semibold">{(selectedDetail as Contact).name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Email</p>
                        <p className="font-semibold">{(selectedDetail as Contact).email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Phone</p>
                        <p className="font-semibold">{(selectedDetail as Contact).phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Submitted</p>
                        <p className="font-semibold">{formatDate((selectedDetail as Contact).created_at)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-text-muted">Message</p>
                        <p className="mt-2 rounded-lg bg-light-gray p-4 text-sm text-slate">{(selectedDetail as Contact).message}</p>
                      </div>
                    </>
                  )}

                  {activeTab === 'applications' && (
                    <>
                      <div>
                        <p className="text-sm text-text-muted">Applicant</p>
                        <p className="font-semibold">{(selectedDetail as Application).applicant_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Email</p>
                        <p className="font-semibold">{(selectedDetail as Application).email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Phone</p>
                        <p className="font-semibold">{(selectedDetail as Application).phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">Submitted</p>
                        <p className="font-semibold">{formatDate((selectedDetail as Application).created_at)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-text-muted">Resume</p>
                        <p className="mt-2 text-sm">
                          {((selectedDetail as Application).resume_url && (
                            <a href={(selectedDetail as Application).resume_url} target="_blank" rel="noreferrer" className="text-primary underline">
                              View uploaded resume
                            </a>
                          )) || 'No resume uploaded.'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {(activeTab === 'referrals' || activeTab === 'applications') && (
                  <div className="mt-8 rounded-3xl border border-light-gray bg-slate/5 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate">Admin Actions</p>
                        <p className="text-sm text-text-muted">Approve or reject this record and refresh dashboard totals.</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleAction('approve', selectedDetail as Referral | Application, activeTab === 'referrals' ? 'referral' : 'application')}
                          disabled={actionLoading}
                          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading ? 'Working...' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction('reject', selectedDetail as Referral | Application, activeTab === 'referrals' ? 'referral' : 'application')}
                          disabled={actionLoading}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionLoading ? 'Working...' : 'Reject'}
                        </button>
                      </div>
                    </div>

                    {actionMessage && (
                      <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate shadow-sm">
                        {actionMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
