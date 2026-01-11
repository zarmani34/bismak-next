import React from "react";
import Link from "next/link";
import { FaLocationPin, FaMailchimp, FaPhone, FaTelegram } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-tetiary pt-16">
      <div className="max-w-7xl mx-auto px-5 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1 lg:pr-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Logo"
                />
              </div>
              <span className="text-2xl font-bold">BISMAK</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Nigeria's leading indigenous contractor delivering world-class
              technical solutions with unwavering commitment to safety, quality,
              and operational excellence since 2009.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold border border-white/20">
                CAC Registered
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold border border-white/20">
                NUPRC Licensed
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded text-xs font-semibold border border-white/20">
                NMDPRA Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-semibold mb-5">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services/pressure-testing"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Pressure Testing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ndt"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Non-Destructive Testing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/fabrication"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Tank Fabrication
                </Link>
              </li>
              <li>
                <Link
                  href="/services/calibration"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Tank Calibration
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cleaning"
                  className="text-white/80 text-sm hover:text-[#D95C3E] transition-colors"
                >
                  Professional Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <FaLocationPin />
                <span className="text-white/80 text-sm leading-relaxed">
                  Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaTelegram />
                <span className="text-white/80 text-sm leading-relaxed">
                  info@bismak.com
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaPhone />
                <span className="text-white/80 text-sm leading-relaxed">
                  +234 XXX XXX XXXX
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaClock />
                <span className="text-white/80 text-sm leading-relaxed">
                  24/7 Emergency Response
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-5">
          <p className="text-white/60 text-sm text-center sm:text-left">
            © 2026 BISMAK Excel and Technical Services Limited. All rights
            reserved.
          </p>
          <div className="flex gap-3">
            <Link
              href="#"
              className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10 hover:bg-[#D95C3E] hover:border-[#D95C3E] transition-all hover:-translate-y-0.5"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10 hover:bg-[#D95C3E] hover:border-[#D95C3E] transition-all hover:-translate-y-0.5"
              aria-label="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10 hover:bg-[#D95C3E] hover:border-[#D95C3E] transition-all hover:-translate-y-0.5"
              aria-label="Twitter"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white border border-white/10 hover:bg-[#D95C3E] hover:border-[#D95C3E] transition-all hover:-translate-y-0.5"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path
                  d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
