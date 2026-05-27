import { useState, useEffect, type FormEvent } from 'react'
import { Briefcase, Heart, Users, Clock3, BookOpen, Trophy, ChevronDown } from 'lucide-react'
import apiClient from '@/lib/api'
import FileUpload from '@/components/FileUpload'

interface Job {
  id: string
  title: string
  type: string
  location: string
  description: string
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [resumeUrl, setResumeUrl] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [applicationError, setApplicationError] = useState('')
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await apiClient.get<Job[]>('/api/jobs')
        if (data?.length) {
          setJobs(data)
        } else {
          setJobs([
            {
              id: '1',
              title: 'Registered Nurse (RN)',
              type: 'Full-time',
              location: 'Tyngsboro',
              description: 'Seeking experienced RNs for skilled nursing visits. Must have current MA license and home health experience.'
            },
            {
              id: '2',
              title: 'Licensed Practical Nurse (LPN)',
              type: 'Per Diem',
              location: 'Both',
              description: 'Per diem LPN positions available. Flexible scheduling.'
            },
            {
              id: '3',
              title: 'Home Health Aide (HHA)',
              type: 'Full-time/Part-time',
              location: 'Tyngsboro',
              description: 'Compassionate HHA to provide assistance with ADLs.'
            },
            {
              id: '4',
              title: 'Physical Therapist (PT)',
              type: 'Full-time',
              location: 'Worcester',
              description: 'PT with home health experience. Help patients regain mobility and independence.'
            },
          ])
        }
      } catch (error) {
        console.error('Unable to load jobs:', error)
        setJobs([
          {
            id: '1',
            title: 'Registered Nurse (RN)',
            type: 'Full-time',
            location: 'Tyngsboro',
            description: 'Seeking experienced RNs for skilled nursing visits. Must have current MA license and home health experience.'
          },
          {
            id: '2',
            title: 'Licensed Practical Nurse (LPN)',
            type: 'Per Diem',
            location: 'Both',
            description: 'Per diem LPN positions available. Flexible scheduling.'
          },
          {
            id: '3',
            title: 'Home Health Aide (HHA)',
            type: 'Full-time/Part-time',
            location: 'Tyngsboro',
            description: 'Compassionate HHA to provide assistance with ADLs.'
          },
          {
            id: '4',
            title: 'Physical Therapist (PT)',
            type: 'Full-time',
            location: 'Worcester',
            description: 'PT with home health experience. Help patients regain mobility and independence.'
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const selectedJob = jobs.find((job) => job.id === selectedJobId)

  const handleToggleJob = (jobId: string) => {
    setExpandedJob((current) => (current === jobId ? null : jobId))
    setApplicationError('')
    setApplicationMessage('')
  }

  const handleApplicationInput = (field: keyof typeof applicationForm, value: string) => {
    setApplicationForm((current) => ({ ...current, [field]: value }))
  }

  const handleUploadSuccess = (result: { publicUrl: string }) => {
    setResumeUrl(result.publicUrl)
    setUploadMessage('Resume uploaded successfully.')
  }

  const handleUploadError = (message: string) => {
    setUploadMessage(`Upload failed: ${message}`)
  }

  const handleSubmitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedJobId) {
      setApplicationError('Please select a position before applying.')
      return
    }

    try {
      setApplicationError('')
      setApplicationMessage('')
      await apiClient.post('/api/applications', {
        job_id: selectedJobId,
        ...applicationForm,
        resume_url: resumeUrl || undefined,
      })
      setApplicationMessage('Application submitted successfully! We will review your materials and follow up soon.')
      setApplicationForm({ applicant_name: '', email: '', phone: '' })
      setSelectedJobId(null)
      setResumeUrl('')
      setUploadMessage('')
    } catch (error: any) {
      console.error('Job application failed:', error)
      setApplicationError(error?.response?.data?.error || 'Unable to submit application. Please try again.')
    }
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">Join Our Team</h1>
          <p className="text-teal text-lg mt-2">Caring professionals making a difference</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">
            Be Part of Something Meaningful
          </h2>
          <p className="text-text-muted">
            At Essy Homecare & Nursing Services, we believe in building a team of passionate, 
            qualified healthcare professionals committed to delivering exceptional patient care. 
            If you're looking for a rewarding career in home healthcare, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading mb-12">Open Positions</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="w-full p-6 text-left hover:bg-light-gray transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-heading font-bold text-lg text-primary">{job.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-text-muted">
                        <span className="px-2 py-1 bg-green/10 text-green rounded">
                          {job.type}
                        </span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 transition-transform ${expandedJob === job.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedJob === job.id && (
                    <div className="px-6 pb-6 border-t border-light-gray">
                      <p className="text-text-muted mb-6 pt-6">{job.description}</p>
                      <button
                        type="button"
                        onClick={() => setSelectedJobId(job.id)}
                        className="btn-primary"
                      >
                        Apply for This Position
                      </button>
                      {selectedJobId === job.id && (
                        <form onSubmit={handleSubmitApplication} className="mt-6 space-y-4">
                          {applicationError && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                              {applicationError}
                            </div>
                          )}
                          {applicationMessage && (
                            <div className="p-4 bg-green/10 border border-green text-green rounded-lg text-sm">
                              {applicationMessage}
                            </div>
                          )}
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                              <span className="text-sm font-semibold text-text-muted">Name</span>
                              <input
                                value={applicationForm.applicant_name}
                                onChange={(event) => handleApplicationInput('applicant_name', event.target.value)}
                                placeholder="Your name"
                                className="mt-2 w-full rounded-lg border border-light-gray p-3"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm font-semibold text-text-muted">Email</span>
                              <input
                                type="email"
                                value={applicationForm.email}
                                onChange={(event) => handleApplicationInput('email', event.target.value)}
                                placeholder="you@example.com"
                                className="mt-2 w-full rounded-lg border border-light-gray p-3"
                              />
                            </label>
                            <label className="block md:col-span-2">
                              <span className="text-sm font-semibold text-text-muted">Phone</span>
                              <input
                                value={applicationForm.phone}
                                onChange={(event) => handleApplicationInput('phone', event.target.value)}
                                placeholder="(555) 123-4567"
                                className="mt-2 w-full rounded-lg border border-light-gray p-3"
                              />
                            </label>
                          </div>
                          <div className="mt-6">
                            <FileUpload
                              onUploadSuccess={handleUploadSuccess}
                              onUploadError={handleUploadError}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                            />
                            {resumeUrl && (
                              <p className="mt-3 text-sm text-green">Resume uploaded: <a href={resumeUrl} target="_blank" rel="noreferrer" className="underline">View file</a></p>
                            )}
                            {uploadMessage && (
                              <p className="mt-3 text-sm text-text-muted">{uploadMessage}</p>
                            )}
                          </div>
                          <button type="submit" className="btn-secondary">
                            Submit Application
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-text-muted mb-4">No positions currently available.</p>
              <p className="text-text-muted">Please check back soon or contact us about future opportunities.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Work Here */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Why Work at Essy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'Professional Growth',
                description: 'Opportunities for continued education and professional development'
              },
              {
                icon: <Heart className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'Meaningful Work',
                description: 'Make a real difference in patients\' lives every day'
              },
              {
                icon: <Users className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'Supportive Team',
                description: 'Work with compassionate, collaborative healthcare professionals'
              },
              {
                icon: <Clock3 className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'Flexible Scheduling',
                description: 'Work-life balance with flexible scheduling options'
              },
              {
                icon: <BookOpen className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'Training & Support',
                description: 'Comprehensive onboarding and ongoing training programs'
              },
              {
                icon: <Trophy className="w-12 h-12 text-green mx-auto mb-4" />,
                title: 'CHAP Accredited',
                description: 'Be part of a nationally recognized, quality-focused organization'
              },
            ].map((item, idx) => (
              <div key={idx} className="card p-6 text-center">
                {item.icon}
                <h3 className="font-heading font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Questions About Careers?</h2>
          <p className="text-light-gray text-lg mb-8">
            Contact us and we'll be happy to discuss career opportunities.
          </p>
          <a href="mailto:info@essyhomecare.com" className="btn-secondary inline-block">
            Send Your Inquiry
          </a>
        </div>
      </section>
    </div>
  )
}
