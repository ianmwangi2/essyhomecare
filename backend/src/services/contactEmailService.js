import { sendAdminEmail } from '../lib/resend.js'
import { log } from '../lib/logger.js'

/**
 * Send admin notification for new contact form submission
 * @param {Object} contact - Contact data from form submission
 * @param {string} contact.name - Contact name
 * @param {string} contact.email - Contact email
 * @param {string} [contact.phone] - Contact phone
 * @param {string} [contact.preferred_office] - Preferred office
 * @param {string} contact.message - Contact message
 */
export const sendContactNotification = async (contact) => {
  try {
    await sendAdminEmail({
      subject: 'New contact form submission',
      html: `
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
        ${contact.preferred_office ? `<p><strong>Preferred office:</strong> ${contact.preferred_office}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    })
    log.info('Contact notification email sent', { email: contact.email })
  } catch (error) {
    log.warn('Contact notification email failed', { email: contact.email, error: error?.message || error })
    throw error
  }
}
