import { supabase } from '../lib/supabase.js'
import dotenv from 'dotenv'

dotenv.config()

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@essyhomecare.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_PASSWORD) {
  console.error('❌ ADMIN_PASSWORD environment variable is required')
  console.error('Usage: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=<password> node src/scripts/setup-admin.js')
  process.exit(1)
}

async function setupAdmin() {
  try {
    console.log('🔧 Setting up initial admin user...')
    console.log(`📧 Email: ${ADMIN_EMAIL}`)

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existing = existingUsers?.users.find(u => u.email === ADMIN_EMAIL)

    if (existing) {
      console.log(`✅ User ${ADMIN_EMAIL} already exists`)
      
      // Check if already admin
      const role = existing.user_metadata?.role || existing.app_metadata?.role
      if (role === 'admin') {
        console.log('✅ User already has admin role')
        return
      }

      // Upgrade to admin
      console.log('Upgrading user to admin...')
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        user_metadata: { role: 'admin' }
      })

      if (updateError) {
        console.error('❌ Failed to upgrade user:', updateError.message)
        process.exit(1)
      }

      console.log(`✅ User ${ADMIN_EMAIL} upgraded to admin`)
      return
    }

    // Create new admin user
    console.log('Creating new admin user...')
    const { data, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      user_metadata: { role: 'admin' },
      email_confirm: true,
    })

    if (createError) {
      console.error('❌ Failed to create user:', createError.message)
      process.exit(1)
    }

    console.log(`✅ Admin user created successfully!`)
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
    console.log(`🆔 User ID: ${data.user.id}`)
    console.log(`👤 Role: admin`)
    console.log('')
    console.log('✨ You can now log in to the admin panel at /admin-login')

  } catch (err) {
    console.error('❌ Error setting up admin:', err.message)
    process.exit(1)
  }
}

setupAdmin()
