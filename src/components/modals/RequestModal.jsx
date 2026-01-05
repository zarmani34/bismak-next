import { FaPhone, FaCheck, FaTimes } from "react-icons/fa";

 const QuickRequestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-primary/60  to-secondary/10 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-primary rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-secondary-dark text-2xl"
        >
          <FaTimes />
        </button>

        {/* Title */}
        <h3 className="text-headers-color mb-6 text-2xl font-semibold text-center">
          Emergency Service Request
        </h3>

        {/* Hotline Section */}
        <div className="text-center mb-6">
          <p className="text-tetiary mb-4">
            For immediate technical assistance, call our 24/7 emergency hotline:
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="tel:+2348189550124"
              className="px-5 py-2 rounded-lg bg-secondary text-light-gray flex items-center gap-2 font-medium hover:bg-secondary-dark transition"
            >
              <FaPhone /> +234 818 955 0124
            </a>
            <a
              href="tel:+2348028145825"
              className="px-5 py-2 rounded-lg border border-tetiary text-tetiary flex items-center gap-2 font-medium hover:bg-primary/10 transition"
            >
              <FaPhone /> +234 802 814 5825
            </a>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="bg-tetiary p-5 rounded-lg border border-border">
          <h4 className="text-primary mb-4 font-semibold">
            Emergency Services Available:
          </h4>
          <ul className="space-y-2 text-body-text">
            {[
              "Pressure System Failures",
              "Tank Integrity Issues",
              "Pipeline Emergencies",
              "Safety Inspections",
            ].map((service, i) => (
              <li key={i} className="flex items-center gap-2">
                <FaCheck className="text-primary" /> {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Note */}
        {/* <p className="text-center mt-6 text-sm text-secondary-text">
          For non-emergency requests, please use our contact form or email us.
        </p> */}
      </div>
    </div>
  );
}

export default QuickRequestModal;