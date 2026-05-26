import { z } from 'zod'

export const referralSchema = z.object({
  patient_first_name: z.string().min(1, 'First name required'),
  patient_last_name: z.string().min(1, 'Last name required'),
  dob: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().default('MA'),
  zip: z.string().optional(),
  phone: z.string().min(10, 'Valid phone required'),
  insurance_type: z.string().optional(),
  referring_physician: z.string().optional(),
  referring_facility: z.string().optional(),
  diagnosis: z.string().optional(),
  services_requested: z.array(z.string()),
  preferred_contact: z.string().optional(),
  preferred_office: z.enum(['tyngsboro', 'worcester']),
  submitter_name: z.string().min(1, 'Submitter name required'),
  submitter_role: z.string().optional(),
  submitter_phone: z.string().optional(),
  submitter_email: z.string().email('Valid email required'),
  hipaa_acknowledged: z.boolean().refine(v => v === true, 'HIPAA acknowledgment required')
})

export const applicationSchema = z.object({
  job_id: z.string().min(1, 'Valid job ID required'),
  applicant_name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional()
})

export const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferred_office: z.enum(['tyngsboro', 'worcester']).optional()
})

export const jobSchema = z.object({
  title: z.string().min(1, 'Title required'),
  type: z.enum(['full-time', 'part-time', 'per-diem']),
  location: z.string().optional(),
  description: z.string().min(1, 'Description required'),
  requirements: z.string().optional(),
  is_active: z.boolean().default(true)
})

export type ReferralInput = z.infer<typeof referralSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type JobInput = z.infer<typeof jobSchema>
