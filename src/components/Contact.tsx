
import { FaPhone, FaTelegram } from "react-icons/fa6";
import { useEffect } from "react";
import { useScrollInView } from "../utils/useScrollInView";
import { TypeSetActiveSection } from "../utils/types";
import PrimaryButton from "./buttons/PrimaryButton";
import TetiaryButton from "./buttons/TetiaryButton";

const Contact = ({setActiveSection}: TypeSetActiveSection) => {
  const [ref, inView] = useScrollInView();

  useEffect(() => {
    if (inView) {
      setActiveSection("contact");
    }
  }, [inView, setActiveSection]);
  return (
    <section ref={ref} id="contact" className="my-9 max-w-7xl mx-6 xl:mx-auto rounded-xl shadow-md scroll-mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 rounded-xl gap-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        {/* Left Content */}
        <div>
          <div className="text-primary font-extrabold uppercase text-xs tracking-wider">
            Get started
          </div>
          <h3 className="text-2xl text-primary-dark font-semibold mt-1">
            Request an on-site assessment or quote
          </h3>
          <p className="text-gray-600 mt-2">
            Tell us about your site and we’ll recommend the safest, most
            cost-effective approach.
          </p>
        </div>

        {/* Right Buttons */}
        <div className="flex gap-3 items-center">
          <a href="mailto:bismak@example.com">
            <PrimaryButton tittle="Email Us"  icon={<FaTelegram/>}/>
          </a>
          <a href="tel:+2348028145825">
            <TetiaryButton tittle="Call now" icon={<FaPhone/>}/>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
