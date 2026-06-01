import { CheckCircle2, ShieldCheck, Clock3, Award } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { icon: <Award className="w-6 h-6 text-orange" />, label: 'CHAP Accredited', description: 'Community Health Accreditation Program' },
    { icon: <ShieldCheck className="w-6 h-6 text-green" />, label: 'Licensed & Bonded', description: 'Full credentials' },
    { icon: <CheckCircle2 className="w-6 h-6 text-green" />, label: 'Background-Checked Staff', description: 'Verified & trusted' },
    { icon: <Clock3 className="w-6 h-6 text-green" />, label: '7-Days-a-Week Admissions', description: 'Always available' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-8 py-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green/10 mb-2">
            {badge.icon}
          </div>
          <p className="text-primary font-semibold">{badge.label}</p>
          <p className="text-text-muted text-sm">{badge.description}</p>
        </div>
      ))}
    </div>
  )
}
