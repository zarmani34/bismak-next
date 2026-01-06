import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { TypeSetActiveSection } from "../utils/types";
import PrimaryButton from "./buttons/PrimaryButton";
import { useScrollInView } from "../utils/useScrollInView";

const AboutUs = ({setActiveSection}:TypeSetActiveSection) => {
  const [ref, inView] = useScrollInView();
  
    useEffect(() => {
      if (inView) {
        setActiveSection("about");
      }
    }, [inView, setActiveSection]);
  const features = [
    "Corporate Affairs Commission (CAC) Registration",
    "Nigerian Upstream Petroleum Regulatory Commission License",
    "NMDPRA Certification & Compliance",
    "Indigenous Nigerian Ownership & Operations",
    "ISO-Certified Quality Management Systems",
    "24/7 Emergency Response Capability",
  ];

  const reasons = [
    "Quality Materials",
    "Trained Workers",
    "Time Availability",
    "Full Warranty",
  ];
  return (
    <section
    ref={ref}
      id="about"
      className="py-16 relative overflow-hidden max-w-7xl mx-auto px-4 scroll-mt-20"
    >
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="about-content">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8">
            Nigeria's Premier Indigenous Oil &amp; Gas Contractor
          </h2>
          <p className="mt-8 text-header-color leading-relaxed">
            Established in 2009, BISMAK EXCEL AND TECHNICAL SERVICES LIMITED
            stands as Nigeria's leading indigenous technical services provider,
            delivering world-class solutions to the oil, gas, and allied
            industries.
          </p>
          <p className="mt-8 text-header-color leading-relaxed">
            Our mission transcends mere service provision – we're committed to
            actualizing Nigeria's local content agenda while maintaining
            international standards of safety, quality, and operational
            excellence.
          </p>

          {/* Features */}
          <ul className="mt-8 space-y-4">
            {features.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 pb-4 ${
                  i !== features.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <FaCheck className="text-primary mt-1" />
                <span className="text-dark-gray">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-8 w-fit">
            <PrimaryButton tittle="Partner with us" />
          </div>
        </div>

        {/* Right Content / Visual */}
        <div className="bg-primary/10 space-y-6 px-4 md:px-12 py-10 md:py-20 rounded-xl max-w-3xl border-2 border-border">
          {/* Mission Card */}
          <div className="bg-light-gray p-6 rounded-2xl shadow-lg border">
            <h4 className="text-primary font-semibold text-lg mb-2">
              Our Mission
            </h4>
            <p className="text-gray-600 leading-relaxed">
              To fulfill and actualize the ideas of local content as vigorously
              pursued by Nigeria's total transformation agenda.
            </p>
          </div>

          {/* Why Choose Us Card */}
          <div className="relative bg-primary text-light-gray p-6 rounded-2xl shadow-lg overflow-hidden">
            <h4 className="font-semibold text-lg mb-4">Why Choose Us</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <FaCheck className="text-white opacity-80" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
