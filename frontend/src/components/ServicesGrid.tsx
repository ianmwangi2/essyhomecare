import { Stethoscope, Heart, Users, MessageSquare, Waves, Brain } from 'lucide-react'

const services = [
  {
    icon: Stethoscope,
    title: 'Skilled Nursing',
    description: 'RNs & LPNs providing wound care, IV therapy, medication management, catheter care, and diabetic care.',
  },
  {
    icon: Waves,
    title: 'Physical Therapy',
    description: 'Functional limitation rehabilitation to restore mobility and independence.',
  },
  {
    icon: Brain,
    title: 'Occupational Therapy',
    description: 'Daily living skills rehabilitation to enhance quality of life.',
  },
  {
    icon: MessageSquare,
    title: 'Speech Therapy',
    description: 'Communication and swallowing care services.',
  },
  {
    icon: Heart,
    title: 'Home Health Aide',
    description: 'Assistance with bathing, dressing, meals, housekeeping, and transportation.',
  },
  {
    icon: Users,
    title: 'Social Services',
    description: 'Social functioning evaluation and community resource referrals by MSWs and LSWs.',
  },
]

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, idx) => {
        const Icon = service.icon
        return (
          <div key={idx} className="card p-8 text-center">
            <Icon className="w-16 h-16 text-green mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-primary mb-3">{service.title}</h3>
            <p className="text-text-muted text-sm leading-relaxed">{service.description}</p>
            <a href="/services" className="inline-block mt-4 text-green font-semibold hover:text-orange transition-colors">
              Learn More →
            </a>
          </div>
        )
      })}
    </div>
  )
}
