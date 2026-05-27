const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0
const isValidEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '')

export const validateReferral = (payload) => {
  const errors = []
  const data = {
    patient_first_name: sanitizeString(payload.patient_first_name),
    patient_last_name: sanitizeString(payload.patient_last_name),
    dob: sanitizeString(payload.dob),
    gender: sanitizeString(payload.gender),
    address: sanitizeString(payload.address),
    city: sanitizeString(payload.city),
    state: sanitizeString(payload.state) || 'MA',
    zip: sanitizeString(payload.zip),
    phone: sanitizeString(payload.phone),
    insurance_type: sanitizeString(payload.insurance_type),
    referring_physician: sanitizeString(payload.referring_physician),
    referring_facility: sanitizeString(payload.referring_facility),
    diagnosis: sanitizeString(payload.diagnosis),
    services_requested: Array.isArray(payload.services_requested) ? payload.services_requested.map(sanitizeString).filter(Boolean) : [],
    preferred_contact: sanitizeString(payload.preferred_contact),
    preferred_office: sanitizeString(payload.preferred_office),
    submitter_name: sanitizeString(payload.submitter_name),
    submitter_role: sanitizeString(payload.submitter_role),
    submitter_phone: sanitizeString(payload.submitter_phone),
    submitter_email: sanitizeString(payload.submitter_email),
    hipaa_acknowledged: payload.hipaa_acknowledged === true,
  }

  if (!isNonEmptyString(data.patient_first_name)) errors.push('Patient first name is required')
  if (!isNonEmptyString(data.patient_last_name)) errors.push('Patient last name is required')
  if (!isNonEmptyString(data.phone) || data.phone.length < 10) errors.push('Valid phone number is required')
  if (!isNonEmptyString(data.submitter_name)) errors.push('Your name is required')
  if (!isValidEmail(data.submitter_email)) errors.push('Valid submitter email is required')
  if (data.services_requested.length === 0) errors.push('At least one service must be selected')
  if (!data.hipaa_acknowledged) errors.push('HIPAA acknowledgment is required')

  return { valid: errors.length === 0, errors, data }
}

export const validateApplication = (payload) => {
  const errors = []
  const data = {
    job_id: sanitizeString(payload.job_id),
    applicant_name: sanitizeString(payload.applicant_name),
    email: sanitizeString(payload.email),
    phone: sanitizeString(payload.phone),
    cover_letter: sanitizeString(payload.cover_letter),
    resume_url: sanitizeString(payload.resume_url),
  }

  if (!isNonEmptyString(data.job_id)) errors.push('Job ID is required')
  if (!isNonEmptyString(data.applicant_name)) errors.push('Applicant name is required')
  if (!isValidEmail(data.email)) errors.push('Valid email is required')

  return { valid: errors.length === 0, errors, data }
}

export const validateContact = (payload) => {
  const errors = []
  const data = {
    name: sanitizeString(payload.name),
    email: sanitizeString(payload.email),
    phone: sanitizeString(payload.phone),
    message: sanitizeString(payload.message),
    preferred_office: sanitizeString(payload.preferred_office),
  }

  if (!isNonEmptyString(data.name)) errors.push('Name is required')
  if (!isValidEmail(data.email)) errors.push('Valid email is required')
  if (!isNonEmptyString(data.message) || data.message.length < 10) errors.push('Message must be at least 10 characters')

  return { valid: errors.length === 0, errors, data }
}

export const validateJob = (payload) => {
  const errors = []
  const data = {
    title: sanitizeString(payload.title),
    type: sanitizeString(payload.type),
    location: sanitizeString(payload.location),
    description: sanitizeString(payload.description),
    is_active: payload.is_active === true,
  }

  if (!isNonEmptyString(data.title)) errors.push('Job title is required')
  if (!isNonEmptyString(data.type)) errors.push('Job type is required')
  if (!isNonEmptyString(data.location)) errors.push('Job location is required')

  return { valid: errors.length === 0, errors, data }
}

export const validateStatusUpdate = (payload) => {
  const errors = []
  const status = sanitizeString(payload.status)
  const allowed = ['new', 'in_review', 'admitted', 'closed', 'open']

  if (!isNonEmptyString(status)) errors.push('Status is required')
  if (status && !allowed.includes(status)) errors.push(`Status must be one of: ${allowed.join(', ')}`)

  return { valid: errors.length === 0, errors, data: { status } }
}
