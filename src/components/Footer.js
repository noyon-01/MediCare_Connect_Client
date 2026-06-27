import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-gray-500 leading-relaxed">
              A modern healthcare ecosystem connecting patients, doctors, and
              hospitals through one intelligent platform.
            </p>
            <div className="flex gap-2 pt-2">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["Home", "/"],
                ["Find Doctors", "/doctors"],
                ["About Us", "/about"],
                ["Contact Us", "/contact"],
                ["Dashboard", "/dashboard"],
              ].map(([l, h]) => (
                <li key={l}>
                  <a
                    href={h}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>
                  240 Wellness Avenue
                  <br />
                  Boston, MA 02118
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href="mailto:support@medicareconnect.app"
                  className="hover:text-blue-600"
                >
                  support@medicareconnect.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>+1 (617) 555-0188</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
              Emergency Hotline
            </h4>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 text-xs text-gray-700 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                24/7 Available
              </div>
              <p className="text-xs text-gray-500 mb-1">Call us anytime (911)</p>
              <a
                href="tel:1-800-MEDICARE"
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                1-800-MEDICARE
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MediCare Connect. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gray-900">
              HIPAA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
