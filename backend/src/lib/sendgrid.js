import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
import { log } from './logger.js'

dotenv.config()

const required = ['SENDGRID_API_KEY', 'FROM_EMAIL', 'ADMIN_EMAIL']
const missing = required.filter((k) => !process.env[k])

// Don’t hard-fail app startup; just disable email sending if misconfigured.
if (missing.length > 0) {
  log.error('SendGrid not configured; email sending disabled', { missing })

} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
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
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    log.warn('SendAdminEmail skipped; SendGrid env vars missing')
    return
  }

  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL,
    subject,
    html: buildHtmlWrapper(html),
  }

  try {
    await sgMail.send(msg)
    log.info('SendAdminEmail sent', { subject })
  } catch (err) {
    log.error('SendAdminEmail failed', err)
    throw err
  }
}

export const sendConfirmationEmail = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    log.warn('SendConfirmationEmail skipped; SendGrid env vars missing')
    return
  }

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html: buildHtmlWrapper(html),
  }

  try {
    await sgMail.send(msg)
    log.info('SendConfirmationEmail sent', { to, subject })
  } catch (err) {
    log.error('SendConfirmationEmail failed', err)
    throw err
  }
}

