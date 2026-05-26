import { Stethoscope, Heart, Users, MessageSquare, Waves, Brain } from 'lucide-react'

const servicesDetail = [
  {
    icon: Stethoscope,
    title: 'Skilled Nursing (SN)',
    description: 'Comprehensive nursing care delivered by RNs and LPNs',
    items: [
      'Initial assessment and plan of care development',
      'Wound dressing and care',
      'Medication teaching and administration',
      'Intravenous (IV) therapy',
      'Catheter care and management',
      'Diabetic care and education',
      'Family education and support',
    ]
  },
  {
    icon: Waves,
    title: 'Physical Therapy (PT)',
    description: 'Functional limitation rehabilitation services',
    items: [
      'Mobility and strength assessment',
      'Therapeutic exercises and training',
      'Pain management techniques',
      'Balance and fall prevention',
      'Gait training',
      'Equipment recommendations',
    ]
  },
  {
    icon: Brain,
    title: 'Occupational Therapy (OT)',
    description: 'Daily living skills rehabilitation',
    items: [
      'Activities of daily living (ADL) assessment',
      'Home adaptation recommendations',
      'Fine motor skill training',
      'Cognitive rehabilitation',
      'Equipment and device training',
      'Independence maximization',
    ]
  },
  {
    icon: MessageSquare,
    title: 'Speech Therapy (ST)',
    description: 'Communication and swallowing care',
    items: [
      'Speech and language assessment',
      'Communication therapy',
      'Swallowing (dysphagia) evaluation and treatment',
      'Voice therapy',
      'Cognitive-communication therapy',
      'Family counseling and support',
    ]
  },
  {
    icon: Heart,
    title: 'Home Health Aide (HHA)',
    description: 'Personal care and assistance with activities of daily living',
    items: [
      'Bathing and grooming assistance',
      'Dressing support',
      'Light meal preparation',
      'Light housekeeping and laundry',
      'Companionship and emotional support',
      'Assistance with transportation to medical appointments',
    ]
  },
  {
    icon: Users,
    title: 'Social Services',
    description: 'Social work services by MSWs and LSWs',
    items: [
      'Social functioning evaluation',
      'Community resource referrals',
      'Counseling and emotional support',
      'Discharge planning assistance',
      'Family education and crisis intervention',
      'Healthcare navigation assistance',
    ]
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">Our Services</h1>
          <p className="text-teal text-lg mt-2">Comprehensive home healthcare solutions</p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {servicesDetail.map((service, idx) => {
            const Icon = service.icon
            return (
              <div key={idx} className="mb-16 pb-16 border-b border-light-gray last:border-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                  <div className="flex flex-col items-center text-center">
                    <Icon className="w-20 h-20 text-green mb-4" />
                    <h2 className="text-2xl font-heading font-bold text-primary mb-3">
                      {service.title}
                    </h2>
                    <p className="text-text-muted">{service.description}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="font-heading font-bold text-primary mb-4">Included Services:</h3>
                    <ul className="space-y-3">
                      {service.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex gap-3">
                          <span className="text-green font-bold flex-shrink-0">•</span>
                          <span className="text-text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light-gray py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-6">Ready to Get Started?</h2>
          <p className="text-text-muted text-lg mb-8">
            Contact us today to learn more about how Essy Homecare & Nursing Services 
            can help your patients receive the care they deserve.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/referrals" className="btn-primary">
              Submit a Referral
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
