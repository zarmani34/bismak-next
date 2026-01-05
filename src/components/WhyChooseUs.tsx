import { FaCertificate, FaUserCog } from "react-icons/fa";
import { FaTruck } from "react-icons/fa6";

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Accredited Processes",
      desc: "We comply with national and international standards for testing and certification.",
      icon: <FaCertificate />,
    },
    {
      title: "Skilled Workforce",
      desc: "Competency-based training, re-certification and quality oversight on every job.",
      icon: <FaUserCog />,
    },
    {
      title: "Rapid Mobilization",
      desc: "Regional teams positioned for fast response to minimize downtime.",
      icon: <FaTruck />,
    },
  ];
  return (
    <section className="my-10 max-w-7xl mx-auto px-4 text-center">
      {/* Heading */}
      <div className="mb-6">
        <div className="text-primary font-bold uppercase text-xs tracking-wide">
          Why Choose Us
        </div>
        <h3 className="mt-1 text-2xl font-semibold text-primary-dark">
          Trusted by operators, built on safety
        </h3>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-6">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="flex-1 rounded-xl border border-border bg-linear-to-b from-white to-gray-50 shadow-md p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-light-gray text-2xl mb-6 bg-linear-to-br from-primary to-primary-light mx-auto">
              {reason.icon}
            </div>
            <h4 className="text-xl  text-header-color font-semibold text-headers mb-3">
              {reason.title}
            </h4>
            <p className="mt-2 text-body-text leading-relaxed mb-4">
              {reason.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
