import { Link } from 'react-router-dom'
import { Phone, Printer } from 'lucide-react'
import ServicesGrid from '@/components/ServicesGrid'
import TrustBadges from '@/components/TrustBadges'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=500&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Compassionate Care, Right at Home
          </h1>
          <p className="text-lg md:text-xl text-light-gray mb-8">
            Nationally accredited home healthcare serving Massachusetts families across Middlesex, Essex, Worcester & Norfolk Counties
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/referrals" className="btn-primary">
              Request Care
            </Link>
            <a href="tel:9787352745" className="btn-outline">
              Call Us 24/7
            </a>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4">
          <TrustBadges />
        </div>
      </section>

      {/* About Snapshot */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-heading">About Essy Homecare</h2>
              <p className="text-text-muted mb-4 leading-relaxed">
                Essy Homecare & Nursing Services is dedicated to providing compassionate, 
                high-quality home healthcare to our clients. We create strong partnerships with 
                families, case managers, discharge planners, and physicians to deliver personalized care.
              </p>
              <div className="bg-teal/10 border-l-4 border-teal p-4 rounded">
                <p className="text-primary font-semibold mb-2">Our Philosophy</p>
                <p className="text-text-muted text-sm">
                  "Essy Homecare & Nursing Services is committed to delivering quality healthcare 
                  through trained, compassionate professionals. We believe every patient deserves dignity, 
                  respect, and individualized care."
                </p>
              </div>
              <Link to="/about" className="inline-block mt-6 text-green font-semibold hover:text-orange transition-colors">
                Learn Our Story →
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&h=500&fit=crop" 
                alt="Healthcare professional"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Our Services</h2>
          <ServicesGrid />
          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Essy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Why Choose Essy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Experienced Team',
                description: 'Our experienced team of clinicians allow for multiple disciplines as need arises.',
              },
              {
                title: 'Flexible Scheduling',
                description: 'Our flexible scheduling allows us to provide care at a time that is convenient for your patients and their families.',
              },
              {
                title: 'Background Checked Staff',
                description: 'Our background checked professional caregivers give patients and their families peace of mind.',
              },
              {
                title: 'Case Management Service',
                description: 'Our Case Management Service is only a phone call away to discuss your patient\'s healthcare options as needs arise.',
              },
            ].map((item, idx) => (
              <div key={idx} className="card p-8 border-l-4 border-orange">
                <h3 className="font-heading font-bold text-lg mb-3 text-primary">
                  {item.title}
                </h3>
                <p className="text-text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area Teaser */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-4">Serving Massachusetts</h2>
          <p className="text-text-muted text-lg mb-6 max-w-2xl mx-auto">
            We serve four counties across Massachusetts with compassionate, professional home healthcare services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border-t-4 border-teal">
              <p className="font-bold text-primary">Middlesex County</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-t-4 border-teal">
              <p className="font-bold text-primary">Essex County</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-t-4 border-teal">
              <p className="font-bold text-primary">Worcester County</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-t-4 border-teal">
              <p className="font-bold text-primary">Norfolk County</p>
            </div>
          </div>
          <Link to="/coverage" className="btn-secondary">
            View Full Coverage Area
          </Link>
        </div>
      </section>

      {/* Referral CTA Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Making a Referral is EASY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-teal/20 p-8 rounded-lg">
              <h3 className="font-heading font-bold text-xl mb-3 text-teal">Tyngsboro Office</h3>
              <p className="mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> (978) 735-2745</p>
              <p className="mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> Alt: (978) 251-2748</p>
              <p className="mb-4 flex items-center gap-2"><Printer className="w-4 h-4 text-teal" /> Fax: (978) 328-0364</p>
              <p className="text-sm text-light-gray">Referrals accepted 7 days a week</p>
            </div>
            <div className="bg-green/20 p-8 rounded-lg">
              <h3 className="font-heading font-bold text-xl mb-3 text-green">Worcester Office</h3>
              <p className="mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-teal" /> (508) 854-4135</p>
              <p className="mb-4 flex items-center gap-2"><Printer className="w-4 h-4 text-teal" /> Fax: (508) 854-4137</p>
              <Link to="/referrals" className="btn-primary inline-block mt-4">
                Submit Online Referral
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Diversity Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-4">Committed to Diversity</h2>
          <p className="text-text-muted text-lg">
            Essy Homecare & Nursing Services is committed to serving a diverse caseload. 
            We offer translation services and multilingual staff to ensure comprehensive communication 
            and culturally sensitive care for all patients.
          </p>
        </div>
      </section>
    </div>
  )
}
