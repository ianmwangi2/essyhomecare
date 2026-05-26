import { CheckCircle2, ShieldCheck, Clock3 } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { icon: <CheckCircle2 className="w-6 h-6 text-green" />, label: 'CHAP Accredited' },
    { icon: <ShieldCheck className="w-6 h-6 text-green" />, label: 'Licensed & Bonded' },
    { icon: <CheckCircle2 className="w-6 h-6 text-green" />, label: 'Background-Checked Staff' },
    { icon: <Clock3 className="w-6 h-6 text-green" />, label: '7-Days-a-Week Admissions' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-center gap-2 text-primary font-semibold">
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  )
}
