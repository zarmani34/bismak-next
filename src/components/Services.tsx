import {
  FaTachometerAlt,
  FaSearch,
  FaTools,
  FaRuler,
  FaBroom,
  FaHardHat,
  FaArrowRight,
} from "react-icons/fa";
import { useEffect } from "react";
import { useScrollInView } from "../utils/useScrollInView";
import { TypeSetActiveSection } from "../utils/types";

const services = [
  {
    icon: <FaTachometerAlt />,
    title: "Pressure Testing & Integrity",
    desc: "Advanced hydro pressure testing for LPG/CNG pipelines, storage tanks, and pressure vessels using state-of-the-art equipment and international standards.",
  },
  {
    icon: <FaSearch />,
    title: "Non-Destructive Testing",
    desc: "Comprehensive NDT services including ultrasonic, radiographic, and magnetic particle testing for tanks, vessels, and pipeline infrastructure.",
  },
  {
    icon: <FaTools />,
    title: "Tank Fabrication & Installation",
    desc: "Custom tank manufacturing, surface and underground storage tank installation with precision engineering and quality assurance protocols.",
  },
  {
    icon: <FaRuler />,
    title: "Tank Calibration Services",
    desc: "Precise volumetric calibration of storage tanks using advanced measurement technologies to ensure accurate inventory management.",
  },
  {
    icon: <FaBroom />,
    title: "Professional Tank Cleaning",
    desc: "Comprehensive tank cleaning services ensuring contamination-free storage and compliance with environmental and safety regulations.",
  },
  {
    icon: <FaHardHat />,
    title: "Construction & Civil Works",
    desc: "Complete construction services including pipeline laying, filling station canopy erection, and specialized civil engineering projects.",
  },
];

const Services = ({setActiveSection}: TypeSetActiveSection) => {
  const [ref, inView] = useScrollInView();
  
    useEffect(() => {
      if (inView) {
        setActiveSection("services");
      }
    }, [inView, setActiveSection]);
  return (
    <section ref={ref} id="services" className="py-20 bg-tetiary scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 text-dark-gray">
            World-Class Technical Services
          </h2>
          <p className="text-secondary-text text-base leading-[1.6]">
            Comprehensive oil and gas solutions delivered by certified
            professionals with cutting-edge equipment and proven methodologies.
          </p>
        </div>

        {/* Services Flexbox */}
        <div className="flex flex-wrap gap-8 justify-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex-1 min-w-75 max-w-sm relative border border-border rounded-2xl overflow-hidden shadow-md bg-white h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
              <div className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-light-gray text-2xl mb-6 bg-linear-to-br from-primary to-primary-light">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl  text-header-color font-semibold text-headers mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-body-text leading-relaxed mb-4">
                  {service.desc}
                </p>

                {/* Link */}
                <a
                  href="#contact"
                  className="inline-flex items-center font-semibold text-primary hover:text-primary-dark transition-colors duration-300 gap-2 group text-sm"
                >
                  <span className="leading-none">Request Service</span>
                  <FaArrowRight className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
