import { sendAdminEmail, sendConfirmationEmail } from '../lib/resend.js'
import { log } from '../lib/logger.js'

/**
 * Send admin notification for new referral submission
 * @param {Object} referral - Referral data
 * @param {string} referral.patient_first_name - Patient first name
 * @param {string} referral.patient_last_name - Patient last name
 * @param {string} [referral.dob] - Date of birth
 * @param {string} [referral.gender] - Gender
 * @param {string} [referral.address] - Address
 * @param {string} [referral.city] - City
 * @param {string} [referral.state] - State
 * @param {string} [referral.zip] - ZIP code
 * @param {string} referral.phone - Phone number
 * @param {string} [referral.insurance_type] - Insurance type
 * @param {string} [referral.referring_physician] - Referring physician
 * @param {string} [referral.referring_facility] - Referring facility
 * @param {string} [referral.diagnosis] - Diagnosis
 * @param {Array<string>} [referral.services_requested] - Services requested
 * @param {string} [referral.preferred_contact] - Preferred contact method
 * @param {string} [referral.preferred_office] - Preferred office
 * @param {string} referral.submitter_name - Submitter name
 * @param {string} [referral.submitter_role] - Submitter role
 * @param {string} [referral.submitter_phone] - Submitter phone
 * @param {string} referral.submitter_email - Submitter email
 */
export const sendReferralAdminNotification = async (referral) => {
  try {
    await sendAdminEmail({
      subject: 'New referral submitted',
      html: `
        <p><strong>Patient:</strong> ${referral.patient_first_name} ${referral.patient_last_name}</p>
        ${referral.dob ? `<p><strong>DOB:</strong> ${referral.dob}</p>` : ''}
        ${referral.gender ? `<p><strong>Gender:</strong> ${referral.gender}</p>` : ''}
        ${referral.address ? `<p><strong>Address:</strong> ${referral.address}</p>` : ''}
        ${referral.city ? `<p><strong>City:</strong> ${referral.city}</p>` : ''}
        ${referral.state ? `<p><strong>State:</strong> ${referral.state}</p>` : ''}
        ${referral.zip ? `<p><strong>ZIP:</strong> ${referral.zip}</p>` : ''}
        <p><strong>Phone:</strong> ${referral.phone}</p>
        ${referral.insurance_type ? `<p><strong>Insurance:</strong> ${referral.insurance_type}</p>` : ''}
        ${referral.referring_physician ? `<p><strong>Referring Physician:</strong> ${referral.referring_physician}</p>` : ''}
        ${referral.referring_facility ? `<p><strong>Referring Facility:</strong> ${referral.referring_facility}</p>` : ''}
        ${referral.diagnosis ? `<p><strong>Diagnosis:</strong> ${referral.diagnosis}</p>` : ''}
        ${Array.isArray(referral.services_requested) ? `<p><strong>Services Requested:</strong> ${referral.services_requested.join(', ')}</p>` : ''}
        ${referral.preferred_contact ? `<p><strong>Preferred Contact:</strong> ${referral.preferred_contact}</p>` : ''}
        ${referral.preferred_office ? `<p><strong>Preferred Office:</strong> ${referral.preferred_office}</p>` : ''}
        <hr/>
        <p><strong>Submitter:</strong> ${referral.submitter_name}</p>
        ${referral.submitter_role ? `<p><strong>Role:</strong> ${referral.submitter_role}</p>` : ''}
        ${referral.submitter_phone ? `<p><strong>Submitter Phone:</strong> ${referral.submitter_phone}</p>` : ''}
        <p><strong>Submitter Email:</strong> ${referral.submitter_email}</p>
      `,
    })
    log.info('Referral notification email sent to admin', { submitterEmail: referral.submitter_email })
  } catch (error) {
    log.warn('Referral notification email failed', { submitterEmail: referral.submitter_email, error: error?.message || error })
    throw error
  }
}

/**
 * Send confirmation email to referral submitter
 * @param {Object} referral - Referral data
 * @param {string} referral.submitter_email - Submitter email
 * @param {string} referral.submitter_name - Submitter name
 */
export const sendReferralConfirmation = async (referral) => {
  try {
    await sendConfirmationEmail({
      to: referral.submitter_email,
      subject: 'Essy Homecare — We received your referral',
      html: `
        <p>Hi ${referral.submitter_name || 'there'},</p>
        <p>Thanks for submitting your referral. Our team will review it and reach out to coordinate next steps.</p>
        <p>If you need to make changes, you can reply to this email.</p>
        <p style="margin-top: 16px;">— Essy Homecare</p>
      `,
    })
    log.info('Referral confirmation email sent to submitter', { submitterEmail: referral.submitter_email })
  } catch (error) {
    log.warn('Referral confirmation email failed', { submitterEmail: referral.submitter_email, error: error?.message || error })
    throw error
  }
}

/**
 * Send both admin notification and submitter confirmation for new referral
 * @param {Object} referral - Referral data
 */
export const sendReferralEmails = async (referral) => {
  try {
    await Promise.all([
      sendReferralAdminNotification(referral),
      sendReferralConfirmation(referral),
    ])
    log.info('All referral emails sent successfully', { submitterEmail: referral.submitter_email })
  } catch (error) {
    log.warn('One or more referral emails failed', { submitterEmail: referral.submitter_email, error: error?.message || error })
    throw error
  }
}
