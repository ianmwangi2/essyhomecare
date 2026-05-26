import { CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">About Essy Homecare</h1>
          <p className="text-teal text-lg mt-2">Compassionate care since day one</p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="section-heading">Our History</h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Founded on principles of compassion and excellence, Essy Homecare & Nursing Services 
                has been a trusted partner in home healthcare across Massachusetts. Our team of dedicated 
                professionals brings decades of combined experience in nursing, therapy, and patient care.
              </p>
              <p className="text-text-muted leading-relaxed">
                We are proud to maintain CHAP (Community Health Accreditation Program) accreditation, 
                demonstrating our commitment to the highest standards of quality and safety.
              </p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop" 
              alt="Medical team"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" 
              alt="Esther Loree, President"
              className="rounded-lg shadow-lg"
            />
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-2">Esther Loree</h3>
              <p className="text-teal font-semibold mb-4">President & Founder</p>
              <p className="text-text-muted leading-relaxed">
                Esther Loree brings decades of experience in healthcare administration and patient advocacy 
                to her role as President of Essy Homecare & Nursing Services. Her vision of compassionate, 
                accessible home healthcare has shaped our organizational culture and commitment to excellence.
              </p>
              <div className="mt-6">
                <p className="font-semibold text-primary mb-2">Contact:</p>
                <a href="mailto:eloree@essynursingservices.com" className="text-green hover:text-orange transition-colors">
                  eloree@essynursingservices.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Mission & Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-teal/10 p-8 rounded-lg border-l-4 border-teal">
              <h3 className="font-heading font-bold text-lg mb-4 text-primary">Our Mission</h3>
              <p className="text-text-muted leading-relaxed">
                Our mission is to provide comprehensive, high-quality homecare services to our clients 
                by creating strong partnerships with their families, case managers, discharge planners, 
                and physicians. We are committed to delivering individualized care that respects the dignity 
                and autonomy of every patient.
              </p>
            </div>
            <div className="bg-green/10 p-8 rounded-lg border-l-4 border-green">
              <h3 className="font-heading font-bold text-lg mb-4 text-primary">Our Philosophy</h3>
              <p className="text-text-muted leading-relaxed">
                Essy Homecare & Nursing Services is dedicated to the provision of quality health care for 
                its clients through trained, compassionate, and professional caregivers. We believe that 
                every individual deserves respectful, dignified care in the comfort of their own home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-heading text-center mb-12">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'Skilled Nursing Facilities',
              'Hospitals & Medical Centers',
              'Physician Practices',
              'Hospice Care Providers',
              'Assisted Living Communities',
              'Rehabilitation Centers',
              'Residential Care Facilities',
              'Home Care Agencies',
              'Insurance Companies',
            ].map((org, idx) => (
              <div key={idx} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green" />
                </div>
                <p className="font-semibold text-primary">{org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAP Accreditation */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-teal/10 p-8 rounded-lg border-2 border-teal mb-8">
            <CheckCircle2 className="w-16 h-16 text-green mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">CHAP Accredited</h3>
            <p className="text-text-muted leading-relaxed">
              We are proud to be accredited by CHAP (Community Health Accreditation Program), 
              a nationally recognized organization that certifies home healthcare agencies meeting 
              rigorous standards for quality, safety, and patient outcomes. CHAP accreditation 
              demonstrates our commitment to continuous improvement and excellence in patient care.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
