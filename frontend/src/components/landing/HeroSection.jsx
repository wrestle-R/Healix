import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FaHeartbeat,
  FaCalendarCheck,
  FaUserMd,
  FaStethoscope,
} from "react-icons/fa";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <FaHeartbeat className="mr-2 h-4 w-4" />
              Healthcare Platform
            </Badge>
          </motion.div>

          <motion.h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-serif">
            Your Health,{" "}
            <motion.span
              className="text-primary"
              whileHover={{
                textShadow: "0px 0px 8px rgb(var(--primary))",
                scale: 1.05,
              }}
            >
              Our Priority
            </motion.span>
          </motion.h1>

          <motion.p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience world-class healthcare with our platform. Connect with
            certified doctors, manage appointments, and take control of your
            health journey.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="px-8 py-6 text-lg font-semibold"
              >
                <FaCalendarCheck className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/login")}
                className="px-8 py-6 text-lg font-semibold"
              >
                <FaUserMd className="mr-2 h-5 w-5" />
                For Healthcare Providers
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Keep background icon animations as is, or remove if you want zero movement */}
    </section>
  );
};

export default HeroSection;
