"use client"

import { Header } from "../components/Header";
import { useState } from "react";
import TrustIndicators from "../components/TrustIndicator";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsCounterDashboard from "../components/StatsCounterDashboard";
export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  return (
    <div>
      <Header activeSection={activeSection}/>
      <TrustIndicators />
      <WhyChooseUs />
      <StatsCounterDashboard />
    </div>
  );
}
