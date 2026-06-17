import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Phone, Printer } from 'lucide-react'
import apiClient from '../lib/api'

const referralSchema = z.object({
  patient_first_name: z.string().min(1, 'First name required'),
  patient_last_name: z.string().min(1, 'Last name required'),
  dob: z.string().optional(),
  gender: z.enum(['', 'Male', 'Female', 'Other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().default('MA'),
  zip: z.string().optional(),
  phone: z.string().min(10, 'Valid phone required'),
  insurance_type: z.string().optional(),
  referring_physician: z.string().optional(),
  referring_facility: z.string().optional(),
  diagnosis: z.string().optional(),
  services_requested: z.array(z.string()).min(1, 'Select at least one service'),
  preferred_contact: z.enum(['', 'Phone', 'Email', 'Fax']).optional(),
  preferred_office: z.enum(['', 'tyngsboro'], {
    errorMap: () => ({ message: 'Select an office' })
  }),
  submitter_name: z.string().min(1, 'Your name required'),
  submitter_role: z.string().optional(),
  submitter_phone: z.string().optional(),
  submitter_email: z.string().email('Valid email required'),
  hipaa_acknowledged: z.boolean().refine(v => v === true, 'HIPAA acknowledgment required')
})

type ReferralForm = z.infer<typeof referralSchema>

export default function ReferralsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ReferralForm>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      state: 'MA',
      services_requested: [],
      preferred_office: '',
    }
  })

  const services = [
    'Skilled Nursing (SN)',
    'Physical Therapy (PT)',
    'Occupational Therapy (OT)',
    'Speech Therapy (ST)',
    'Home Health Aide (HHA)',
    'Social Services'
  ]

  const servicesRequested = watch('services_requested')

  const onSubmit = async (data: ReferralForm) => {
    try {
      setSubmitError('')
      await apiClient.post('/api/referrals', data)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      console.error('Error submitting referral:', error)
      setSubmitError(error?.response?.data?.error || 'Unable to submit referral. Please try again.')
    }
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">Making a Referral is EASY</h1>
          <p className="text-teal text-lg mt-2">Referrals accepted 7 days a week</p>
        </div>
      </section>

      {/* Who can refer */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {['Physician', 'Hospital', 'Nursing Home', 'Insurance Co.', 'Caregiver', 'Family', 'Friends', 'Self-Referral'].map((role, idx) => (
              <div key={idx} className="card p-4 text-center">
                <p className="font-semibold text-primary">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Online Referral Form</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green/10 border border-green text-green rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Referral submitted successfully! We'll contact you soon.</span>
            </div>
          )}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Patient Information */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Patient Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">First Name *</label>
                  <input {...register('patient_first_name')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  {errors.patient_first_name && <p className="text-red-500 text-sm mt-1">{errors.patient_first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Last Name *</label>
                  <input {...register('patient_last_name')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  {errors.patient_last_name && <p className="text-red-500 text-sm mt-1">{errors.patient_last_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Date of Birth</label>
                  <input {...register('dob')} type="date" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Gender</label>
                  <select {...register('gender')} className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Address */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Address</legend>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Address</label>
                  <input {...register('address')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">City</label>
                    <input {...register('city')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">State</label>
                    <input {...register('state')} type="text" value="MA" disabled className="w-full px-4 py-2 border border-light-gray rounded-lg bg-light-gray" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">Zip</label>
                    <input {...register('zip')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Contact Information */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Contact Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Phone *</label>
                  <input {...register('phone')} type="tel" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Insurance Type</label>
                  <input {...register('insurance_type')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
              </div>
            </fieldset>

            {/* Medical Information */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Medical Information</legend>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Referring Physician</label>
                  <input {...register('referring_physician')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Referring Facility/Hospital</label>
                  <input {...register('referring_facility')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Diagnosis / Reason for Referral</label>
                  <textarea {...register('diagnosis')} rows={4} className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
              </div>
            </fieldset>

            {/* Services Requested */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Services Requested *</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {services.map((service) => (
                  <label key={service} className="flex items-center gap-3 p-3 border border-light-gray rounded-lg cursor-pointer hover:bg-light-gray transition-colors">
                    <input
                      type="checkbox"
                      value={service}
                      {...register('services_requested')}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="font-medium text-text">{service}</span>
                  </label>
                ))}
              </div>
              {errors.services_requested && <p className="text-red-500 text-sm mt-2">{errors.services_requested.message}</p>}
            </fieldset>

            {/* Preferences */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Preferences</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Preferred Contact Method</label>
                  <select {...register('preferred_contact')} className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal">
                    <option value="">Select</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Fax">Fax</option>
                  </select>
                </div>

              </div>
            </fieldset>

            {/* Submitter Information */}
            <fieldset className="border border-light-gray p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-primary">Submitter Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Your Name *</label>
                  <input {...register('submitter_name')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  {errors.submitter_name && <p className="text-red-500 text-sm mt-1">{errors.submitter_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Your Role</label>
                  <input {...register('submitter_role')} type="text" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Your Phone</label>
                  <input {...register('submitter_phone')} type="tel" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Your Email *</label>
                  <input {...register('submitter_email')} type="email" className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal" />
                  {errors.submitter_email && <p className="text-red-500 text-sm mt-1">{errors.submitter_email.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* HIPAA */}
            <fieldset className="border border-green/20 bg-green/5 p-6 rounded-lg">
              <legend className="px-2 font-heading font-bold text-green">HIPAA Acknowledgment</legend>
              <div className="mt-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register('hipaa_acknowledged')}
                    className="w-5 h-5 rounded border-gray-300 mt-1"
                  />
                  <span className="text-sm text-text">
                    I acknowledge that I am authorized to submit this referral and that the information provided 
                    complies with HIPAA regulations and confidentiality requirements.
                  </span>
                </label>
                {errors.hipaa_acknowledged && <p className="text-red-500 text-sm mt-2">{errors.hipaa_acknowledged.message}</p>}
              </div>
            </fieldset>

            {/* Submit */}
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">
                Submit Referral
              </button>
              <button type="reset" onClick={() => reset()} className="px-6 py-3 border-2 border-teal text-teal rounded-full font-semibold hover:bg-teal hover:text-white transition-all duration-200">
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Manual Contact */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Or Contact Us Directly</h2>
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <h3 className="font-heading font-bold text-lg text-teal mb-4">Tyngsboro Office</h3>
              <p className="mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> (978) 735-2745</p>
              <p className="mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> (978) 251-2748</p>
              <p className="mb-4 flex items-center gap-2"><Printer className="w-4 h-4 text-teal" /> (978) 328-0364</p>
              <p className="text-sm text-text-muted">Fax is available 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
