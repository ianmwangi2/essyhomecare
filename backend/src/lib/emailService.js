import { sendAdminEmail, sendConfirmationEmail } from './resend.js'
import { log } from './logger.js'

const FROM_NAME = 'Essy Nursing Services'

export const contactAutoReply = async ({ to, name }) => {
  try {
    await sendConfirmationEmail({
      to,
      subject: 'Thanks for contacting Essy Nursing Services',
      html: `
        <p>Hi ${name || 'there'},</p>
        <p>Thanks for getting in touch. We received your message and will respond as soon as possible.</p>
        <p style="margin-top:16px;">— ${FROM_NAME}</p>
      `,
    })
    log.info('contactAutoReply sent', { to })
  } catch (err) {
    log.warn('contactAutoReply failed', { to, error: err?.message || err })
    throw err
  }
}

export const contactInternalAlert = async ({ name, email, message }) => {
  try {
    await sendAdminEmail({
      subject: 'New contact form submission',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    log.info('contactInternalAlert sent', { name, email })
  } catch (err) {
    log.warn('contactInternalAlert failed', { name, email, error: err?.message || err })
    throw err
  }
}

export const referralConfirmation = async ({ to, referrerName, patientName }) => {
  try {
    await sendConfirmationEmail({
      to,
      subject: 'We received your referral',
      html: `
        <p>Hi ${referrerName || 'there'},</p>
        <p>Thanks for referring ${patientName || 'the patient'}. Our team will review the details and be in touch.</p>
        <p style="margin-top:16px;">— ${FROM_NAME}</p>
      `,
    })
    log.info('referralConfirmation sent', { to, referrerName, patientName })
  } catch (err) {
    log.warn('referralConfirmation failed', { to, error: err?.message || err })
    throw err
  }
}

export const referralInternalAlert = async ({ referrerName, referrerEmail, patientName, patientContact, notes }) => {
  try {
    await sendAdminEmail({
      subject: 'New referral submitted',
      html: `
        <p><strong>Referrer:</strong> ${referrerName}</p>
        <p><strong>Referrer Email:</strong> ${referrerEmail}</p>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Patient Contact:</strong> ${patientContact}</p>
        ${notes ? `<hr/><p><strong>Notes:</strong></p><p>${notes}</p>` : ''}
      `,
    })
    log.info('referralInternalAlert sent', { referrerEmail, patientName })
  } catch (err) {
    log.warn('referralInternalAlert failed', { referrerEmail, error: err?.message || err })
    throw err
  }
}

export const jobApplicationReply = async ({ to, applicantName, position }) => {
  try {
    await sendConfirmationEmail({
      to,
      subject: `Application received — ${position || 'Position'}`,
      html: `
        <p>Hi ${applicantName || ''},</p>
        <p>Thanks for applying for the ${position || 'position'} at Essy Nursing Services. We received your application and will review it shortly.</p>
        <p style="margin-top:16px;">— ${FROM_NAME}</p>
      `,
    })
    log.info('jobApplicationReply sent', { to, position })
  } catch (err) {
    log.warn('jobApplicationReply failed', { to, error: err?.message || err })
    throw err
  }
}

export const jobApplicationAlert = async ({ applicantName, applicantEmail, position, cvLink }) => {
  try {
    await sendAdminEmail({
      subject: `New job application: ${applicantName} — ${position}`,
      html: `
        <p><strong>Applicant:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Position:</strong> ${position}</p>
        ${cvLink ? `<p><strong>CV:</strong> <a href="${cvLink}">Download</a></p>` : ''}
      `,
    })
    log.info('jobApplicationAlert sent', { applicantEmail, position })
  } catch (err) {
    log.warn('jobApplicationAlert failed', { applicantEmail, error: err?.message || err })
    throw err
  }
}

export default {
  contactAutoReply,
  contactInternalAlert,
  referralConfirmation,
  referralInternalAlert,
  jobApplicationReply,
  jobApplicationAlert,
}
