import { Resend } from 'resend'
import dotenv from 'dotenv'
import { log } from './logger.js'

dotenv.config()

const required = ['RESEND_API_KEY', 'FROM_EMAIL', 'ADMIN_EMAIL']
const missing = required.filter((k) => !process.env[k])

let resend = null
// Don't hard-fail app startup; just disable email sending if misconfigured.
if (missing.length > 0) {
  log.error('Resend not configured; email sending disabled', { missing })
} else {
  resend = new Resend(process.env.RESEND_API_KEY)
}

const buildHtmlWrapper = (innerHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.4;">
    <div style="margin-bottom: 16px;">
      <strong>Essy Homecare</strong>
    </div>
    ${innerHtml}
    <div style="margin-top: 24px; font-size: 12px; color: #666;">
      Sent by automated website notifications.
    </div>
  </div>
`

export const sendAdminEmail = async ({ subject, html }) => {
  if (!resend || !process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    log.warn('SendAdminEmail skipped; Resend env vars missing')
    return
  }

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: buildHtmlWrapper(html),
    })

    if (response.error) {
      log.error('SendAdminEmail failed', response.error)
      throw response.error
    }

    log.info('SendAdminEmail sent', { subject, messageId: response.data?.id })
  } catch (err) {
    log.error('SendAdminEmail failed', err)
    throw err
  }
}

export const sendConfirmationEmail = async ({ to, subject, html }) => {
  if (!resend || !process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    log.warn('SendConfirmationEmail skipped; Resend env vars missing')
    return
  }

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html: buildHtmlWrapper(html),
    })

    if (response.error) {
      log.error('SendConfirmationEmail failed', response.error)
      throw response.error
    }

    log.info('SendConfirmationEmail sent', { to, subject, messageId: response.data?.id })
  } catch (err) {
    log.error('SendConfirmationEmail failed', err)
    throw err
  }
}
