"use client"

import { Header } from "../components/Header";
import { useState } from "react";
import TrustIndicators from "../components/TrustIndicator";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsCounterDashboard from "../components/StatsCounterDashboard";
import Hero from "../components/Hero";
import Services from "../components/Services";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import TrustedClients from "../components/TrustedClients";
export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  return (
    <div>
      <Header activeSection={activeSection}/>
      <Hero setActiveSection={setActiveSection} />
      <TrustIndicators />
      <Services setActiveSection={setActiveSection} />
      <WhyChooseUs />
      <TrustedClients />
      <StatsCounterDashboard />
      <AboutUs setActiveSection={setActiveSection} />
      <Contact setActiveSection={setActiveSection} />
      <Footer />
    </div>
  );
}
