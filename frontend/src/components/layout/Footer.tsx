import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/essy-logo.svg"
                alt="Essy Homecare logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-text-muted">CHAP-accredited home healthcare services across Massachusetts.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-teal rounded-full hover:bg-orange transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-teal rounded-full hover:bg-orange transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold mb-4 text-teal">Quick Links</h3>
            <ul className="space-y-2 text-text-muted">
              <li><Link to="/about" className="hover:text-green transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-green transition-colors">Services</Link></li>
              <li><Link to="/referrals" className="hover:text-green transition-colors">Referrals</Link></li>
              <li><Link to="/careers" className="hover:text-green transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Tyngsboro Office */}
          <div>
            <h3 className="font-heading font-bold mb-4 text-teal">Tyngsboro Office</h3>
            <div className="space-y-3 text-text-muted text-sm">
              <div className="flex gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-0.5 text-green" />
                <p>1 Bridgeview Cir.<br />Building D, Unit 2<br />Tyngsboro, MA 01879</p>
              </div>
              <div className="flex gap-2">
                <Phone size={18} className="flex-shrink-0 text-green" />
                <div>
                  <p>(978) 735-2745</p>
                  <p>Alt: (978) 251-2748</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail size={18} className="flex-shrink-0 text-green" />
                <p>Fax: (978) 328-0364</p>
              </div>
            </div>
          </div>

          {/* Worcester Office */}
          <div>
            <h3 className="font-heading font-bold mb-4 text-teal">Worcester Office</h3>
            <div className="space-y-3 text-text-muted text-sm">
              <div className="flex gap-2">
                <Phone size={18} className="flex-shrink-0 text-green" />
                <p>(508) 854-4135</p>
              </div>
              <div className="flex gap-2">
                <Mail size={18} className="flex-shrink-0 text-green" />
                <p>Fax: (508) 854-4137</p>
              </div>
              <div className="flex gap-2">
                <Mail size={18} className="flex-shrink-0 text-green" />
                <a href="mailto:info@essyhomecare.com" className="hover:text-green transition-colors">
                  info@essyhomecare.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-teal pt-8 flex items-center justify-between text-sm text-text-muted">
          <p>&copy; 2024 Essy Homecare & Nursing Services. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-green transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-green transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
