import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCompass,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "motion/react";
import { useScrollInView } from "../utils/useScrollInView";
import PrimaryButton from "./buttons/PrimaryButton";
import SecondaryButton from "./buttons/SecondaryButton";
import { TypeSetActiveSection } from "../utils/types";

const Hero = ({setActiveSection}: TypeSetActiveSection) => {
  const [ref, inView] = useScrollInView();
  const [currentImage, setCurrentImage] = useState(0);
  
    useEffect(() => {
      if (inView) {
        setActiveSection("home");
      }
    }, [inView, setActiveSection]);

  const heroImages = [
    "/hero4.jpeg", // Field work scene
    "/hero5.jpeg", // Field work scene
    "/hero6.jpeg", // Field work scene
    "/hero8.jpeg", // Field work scene
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} id="home">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <AnimatePresence mode="sync">
              <motion.img
                key={currentImage}
                src={heroImages[currentImage]}
                alt={`Industrial scene ${currentImage + 1}`}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ opacity: 0 }} // start hidden
                animate={{ opacity: 1 }} // fade in
                exit={{ opacity: 0 }} // fade out
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
          {/* gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-primary-dark/80 via-tetiary/20 to-secondary/30"></div>
          <div className="absolute inset-0 bg-linear-to-t from-primary-dark/70 via-transparent to-primary-dark/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="md:mb-8 flex justify-center">
            <div
              className="
          px-3 py-1.5 w-fit my-2 mx-auto
          rounded-full
          font-extrabold
          text-xs
          tracking-widest
          text-primary-dark
          bg-linear-to-r from-primary/20 to-secondary/15 inline-flex items-center"
            >
              <div className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse"></div>
              Oil, Gas &amp; Allied Contractors
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-tetiary md:mb-6 leading-tight">
            <span className="block">Industrial</span>
            <span className="block bg-primary-dark md:pb-3 bg-clip-text text-transparent">
              Integrity
            </span>
            <span className="block text-xl md:text-2xl font-normal text-tetiary/80 md:mt-2">
              Measured & Delivered Nationwide
            </span>
          </h1>
          <p className="text-sm md:text-xl text-tetiary max-w-3xl mx-auto mb-2 md:mb-10 leading-relaxed">
            Nigeria's leading indigenous contractor delivering world-class
            technical solutions with unwavering commitment to safety, quality,
            and operational excellence since{" "}
            <span className="text-primary-dark font-semibold">2009</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-2 md:mb-6">
            <PrimaryButton
              tittle="Explore services"
              icon={<FaCompass />}
            />
            <SecondaryButton
              tittle="View Projects"
              icon={<FaBriefcase />}
            />
            {/* <TetiaryButton
              tittle="Request Callback"
              action="#services"
              icon={<FaPhoneAlt />}
            /> */}
          </div>
          {/* <StatsCounter /> */}
        </div>

        {/* Image Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transition-transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "bg-secondary scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-white/60">
          <span className="text-xs mb-2">Scroll</span>
          <div className="w-0.5 h-8 bg-linear-to-b from-white/60 to-transparent animate-pulse"></div>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
