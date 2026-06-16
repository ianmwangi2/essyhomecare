import { sendAdminEmail, sendConfirmationEmail } from '../lib/resend.js'
import { log } from '../lib/logger.js'

/**
 * Send admin notification for new job application
 * @param {Object} application - Application data
 * @param {string} application.applicant_name - Applicant name
 * @param {string} application.email - Applicant email
 * @param {string} [application.phone] - Applicant phone
 * @param {string} [application.job_id] - Job ID applied for
 * @param {string} [application.cover_letter] - Cover letter
 * @param {string} [application.resume_url] - Resume URL
 */
export const sendApplicationAdminNotification = async (application) => {
  try {
    await sendAdminEmail({
      subject: 'New job application submitted',
      html: `
        <p><strong>Applicant:</strong> ${application.applicant_name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        ${application.phone ? `<p><strong>Phone:</strong> ${application.phone}</p>` : ''}
        ${application.job_id ? `<p><strong>Job ID:</strong> ${application.job_id}</p>` : ''}
        ${application.cover_letter ? `<p><strong>Cover Letter:</strong></p><p>${application.cover_letter}</p>` : ''}
        ${application.resume_url ? `<p><strong>Resume URL:</strong> <a href="${application.resume_url}">Download</a></p>` : ''}
      `,
    })
    log.info('Application notification email sent to admin', { email: application.email })
  } catch (error) {
    log.warn('Application notification email failed', { email: application.email, error: error?.message || error })
    throw error
  }
}

/**
 * Send confirmation email to job applicant
 * @param {Object} application - Application data
 * @param {string} application.email - Applicant email
 * @param {string} application.applicant_name - Applicant name
 */
export const sendApplicationConfirmation = async (application) => {
  try {
    await sendConfirmationEmail({
      to: application.email,
      subject: 'Essy Homecare — We received your application',
      html: `
        <p>Hi ${application.applicant_name || ''},</p>
        <p>Thank you for applying to Essy Homecare. We've received your application and our team will review it shortly.</p>
        <p>If you have any questions, reply to this email.</p>
        <p style="margin-top: 16px;">— Essy Homecare</p>
      `,
    })
    log.info('Application confirmation email sent to applicant', { email: application.email })
  } catch (error) {
    log.warn('Application confirmation email failed', { email: application.email, error: error?.message || error })
    throw error
  }
}

/**
 * Send both admin notification and applicant confirmation for new job application
 * @param {Object} application - Application data
 */
export const sendApplicationEmails = async (application) => {
  try {
    await Promise.all([
      sendApplicationAdminNotification(application),
      sendApplicationConfirmation(application),
    ])
    log.info('All application emails sent successfully', { email: application.email })
  } catch (error) {
    log.warn('One or more application emails failed', { email: application.email, error: error?.message || error })
    throw error
  }
}
