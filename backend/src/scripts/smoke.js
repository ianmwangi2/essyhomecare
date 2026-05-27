import assert from 'node:assert'
import { validateReferral, validateContact, validateApplication, validateJob } from '../lib/validators.js'

const referralPayload = {
  patient_first_name: 'Jane',
  patient_last_name: 'Doe',
  phone: '9781234567',
  services_requested: ['Skilled Nursing (SN)'],
  submitter_name: 'Test User',
  submitter_email: 'test@example.com',
  hipaa_acknowledged: true,
}

const contactPayload = {
  name: 'Test User',
  email: 'test@example.com',
  message: 'I would like more information about your services.',
}

const applicationPayload = {
  job_id: 'job-123',
  applicant_name: 'Jane Doe',
  email: 'jane@example.com',
}

const jobPayload = {
  title: 'Home Health Aide',
  type: 'Full-time',
  location: 'Tyngsboro',
  description: 'A mobile home health aide position.',
}

assert(validateReferral(referralPayload).valid, 'Referral validation should succeed')
assert(validateContact(contactPayload).valid, 'Contact validation should succeed')
assert(validateApplication(applicationPayload).valid, 'Application validation should succeed')
assert(validateJob(jobPayload).valid, 'Job validation should succeed')
assert(!validateReferral({}).valid, 'Referral validation should fail for empty payload')
assert(!validateContact({}).valid, 'Contact validation should fail for empty payload')
assert(!validateApplication({}).valid, 'Application validation should fail for empty payload')
assert(!validateJob({}).valid, 'Job validation should fail for empty payload')

console.log('✅ Backend smoke tests passed')
