import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import apiClient from '@/lib/api'

const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferred_office: z.enum(['', 'tyngsboro', 'worcester']).optional(),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    try {
      setSubmitError('')
      await apiClient.post('/api/contacts', data)
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      console.error('Error submitting contact:', error)
      setSubmitError(error?.response?.data?.error || 'Unable to send your message. Please try again.')
    }
  }

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">Contact Us</h1>
          <p className="text-teal text-lg mt-2">We're here to help</p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Tyngsboro */}
            <div className="card p-8 border-t-4 border-teal">
              <h2 className="font-heading font-bold text-xl text-teal mb-6">Tyngsboro Office</h2>
              <div className="space-y-4 text-text-muted">
                <div>
                  <p className="font-semibold text-primary">Address</p>
                  <p>1 Bridgeview Circle<br />Building D, Unit 2<br />Tyngsboro, MA 01879</p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Phone</p>
                  <a href="tel:9787352745" className="text-green hover:text-orange transition-colors">
                    (978) 735-2745
                  </a>
                  <br />
                  <a href="tel:9782512748" className="text-green hover:text-orange transition-colors">
                    (978) 251-2748
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-primary">Fax</p>
                  <p>(978) 328-0364</p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Hours</p>
                  <p>24/7 Admissions</p>
                </div>
              </div>
            </div>

            {/* Worcester */}
            <div className="card p-8 border-t-4 border-green">
              <h2 className="font-heading font-bold text-xl text-green mb-6">Worcester Office</h2>
              <div className="space-y-4 text-text-muted">
                <div>
                  <p className="font-semibold text-primary">Phone</p>
                  <a href="tel:5088544135" className="text-green hover:text-orange transition-colors">
                    (508) 854-4135
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-primary">Fax</p>
                  <p>(508) 854-4137</p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Email</p>
                  <a href="mailto:info@essyhomecare.com" className="text-green hover:text-orange transition-colors">
                    info@essyhomecare.com
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-primary">Hours</p>
                  <p>24/7 Admissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="section-heading text-center mb-12">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green/10 border border-green text-green rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Name *</label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Email *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Phone</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Preferred Office</label>
                <select
                  {...register('preferred_office')}
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  <option value="">Select</option>
                  <option value="tyngsboro">Tyngsboro</option>
                  <option value="worcester">Worcester</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Message *</label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="bg-orange/10 border-l-4 border-orange py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading font-bold text-xl text-orange mb-4">Emergency Care Needed?</h2>
          <p className="text-text-muted mb-4">
            For immediate medical emergencies, please call 911. 
            For non-emergency urgent care questions, contact our offices directly at the numbers above.
          </p>
        </div>
      </section>
    </div>
  )
}
