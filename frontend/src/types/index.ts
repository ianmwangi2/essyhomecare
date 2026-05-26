export interface Referral {
  id: string
  created_at: string
  patient_first_name: string
  patient_last_name: string
  dob?: string
  gender?: string
  address?: string
  city?: string
  state: string
  zip?: string
  phone: string
  insurance_type?: string
  referring_physician?: string
  referring_facility?: string
  diagnosis?: string
  services_requested: string[]
  preferred_contact?: string
  preferred_office: 'tyngsboro' | 'worcester'
  submitter_name: string
  submitter_role?: string
  submitter_phone?: string
  submitter_email: string
  document_url?: string
  hipaa_acknowledged: boolean
  status: 'new' | 'in_review' | 'admitted' | 'closed'
}

export interface Job {
  id: string
  created_at: string
  title: string
  type: 'full-time' | 'part-time' | 'per-diem'
  location?: string
  description: string
  requirements?: string
  is_active: boolean
}

export interface Application {
  id: string
  created_at: string
  job_id: string
  applicant_name: string
  email: string
  phone?: string
  resume_url?: string
  status: string
}

export interface Contact {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  message: string
  preferred_office?: 'tyngsboro' | 'worcester'
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  items: string[]
}
