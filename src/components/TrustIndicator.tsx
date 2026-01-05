import { FaShieldAlt } from "react-icons/fa";
import { FaAward, FaCertificate } from "react-icons/fa6";

const TrustIndicators = () => {
  const certifications = [
    {
      icon: <FaCertificate />,
      title: "CAC Registered",
      desc: "Corporate Affairs Commission",
    },
    {
      icon: <FaShieldAlt />,
      title: "NUPRC Licensed",
      desc: "Upstream Petroleum Regulatory Commission",
    },
    {
      icon: <FaAward />,
      title: "NMDPRA Certified",
      desc: "Midstream & Downstream Petroleum",
    },
  ];

  return (
     <section className="bg-white py-16 border-y  border-t-2 border-primary/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-sm font-medium uppercase tracking-widest text-secondary-text mb-10">
          Certified & Licensed by Leading Regulatory Bodies
        </h3>

        <div className="flex justify-center flex-col md:flex-row gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-light-gray rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 border-[1px] border-border"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="text-primary text-4xl">{cert.icon}</div>
                <div >
                  <strong className="text-lg text-primary-dark">{cert.title}</strong>
                  <p className="text-sm text-secondary-text">{cert.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
