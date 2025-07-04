import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";
import HeroSection from "../components/landing/HeroSection";
import ServicesSection from "../components/landing/ServicesSection";
import DoctorsSection from "../components/landing/DoctorsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import TherapySection from "../components/landing/TherapySection"

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === "patient") {
        navigate("/patient-dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Removed animation from logo */}
            <div className="text-2xl font-bold text-primary font-sans">
              Healix
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer"
              >
                Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer"
              >
                Doctors
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => document.getElementById('therapy')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer"
              >
                Therapy
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-foreground hover:text-primary transition-colors font-medium bg-transparent border-none cursor-pointer"
              >
                Testimonials
              </motion.button>
              
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Sign In
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate("/register")}
                  className="font-medium"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* All Sections */}
      <HeroSection />
      <ServicesSection />
      <DoctorsSection />
      <TherapySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
