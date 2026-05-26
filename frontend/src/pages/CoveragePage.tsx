export default function CoveragePage() {
  const counties = [
    {
      name: 'Middlesex County',
      cities: [
        'Arlington', 'Billerica', 'Burlington', 'Cambridge', 'Chelmsford', 'Concord',
        'Dracut', 'Dunstable', 'Framingham', 'Groton', 'Lincoln', 'Littleton',
        'Lowell', 'Malden', 'Marlborough', 'Medford', 'Pepperell', 'Reading',
        'Somerville', 'Stoneham', 'Tewksbury', 'Townsend', 'Waltham', 'Watertown',
        'Westford', 'Wilmington', 'Winchester', 'Woburn'
      ]
    },
    {
      name: 'Essex County',
      cities: [
        'Andover', 'Danvers', 'Groveland', 'Haverhill', 'Lawrence', 'Merrimac',
        'Methuen', 'Middleton', 'Peabody', 'Salem', 'Saugus'
      ]
    },
    {
      name: 'Worcester County',
      cities: ['Worcester']
    },
    {
      name: 'Norfolk County',
      cities: ['Braintree', 'Dedham']
    },
  ]

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-heading font-bold">Coverage Area</h1>
          <p className="text-teal text-lg mt-2">Serving Massachusetts with pride</p>
        </div>
      </section>

      {/* Coverage intro */}
      <section className="py-12 bg-light-gray">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-text-muted">
            We proudly serve patients and families across four Massachusetts counties. 
            If you don't see your city listed, please contact us to confirm coverage.
          </p>
        </div>
      </section>

      {/* County Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {counties.map((county, idx) => (
              <div key={idx} className="card p-8 border-t-4 border-teal">
                <h2 className="text-2xl font-heading font-bold text-teal mb-6">
                  {county.name}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {county.cities.map((city, cityIdx) => (
                    <p key={cityIdx} className="text-text-muted text-sm py-2 px-3 bg-light-gray rounded">
                      {city}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Not Sure If We Cover Your Area?</h2>
          <p className="text-lg text-light-gray mb-8">
            Contact us directly and we'll let you know if we can serve you or your patient.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="tel:9787352745" className="btn-secondary">
              Call Tyngsboro: (978) 735-2745
            </a>
            <a href="tel:5088544135" className="btn-outline">
              Call Worcester: (508) 854-4135
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
