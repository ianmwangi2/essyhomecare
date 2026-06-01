import { Award } from 'lucide-react'

interface CHAPBadgeProps {
  variant?: 'inline' | 'standalone'
  size?: 'sm' | 'md' | 'lg'
}

export default function CHAPBadge({ variant = 'inline', size = 'md' }: CHAPBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  if (variant === 'standalone') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-orange to-orange/80 rounded-full border-2 border-white shadow-lg`}>
          <Award className="text-white" size={size === 'lg' ? 40 : size === 'md' ? 28 : 16} />
        </div>
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-bold text-primary`}>CHAP Accredited</p>
          <p className={`${textSizeClasses[size]} text-text-muted`}>Community Health</p>
          <p className={`${textSizeClasses[size]} text-text-muted`}>Accreditation Program</p>
          <p className={`${textSizeClasses[size]} text-text-muted font-semibold mt-1`}>Certified Health Care Agency</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange to-orange/80 rounded-full border-2 border-white shadow-md`}>
        <Award className="text-white" size={size === 'lg' ? 32 : size === 'md' ? 20 : 12} />
      </div>
      <div>
        <p className={`${textSizeClasses[size]} font-bold text-primary`}>CHAP Accredited</p>
        <p className={`${textSizeClasses[size]} text-text-muted`}>Certified Health Care Agency</p>
      </div>
    </div>
  )
}
