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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <FaHeartbeat className="mr-2 h-4 w-4" />
              Healthcare Platform
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-serif"
          >
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

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Experience world-class healthcare with our platform. Connect with
            certified doctors, manage appointments, and take control of your
            health journey.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
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

      {/* Animated background elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 text-primary/20 text-6xl"
      >
        <FaHeartbeat />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 text-secondary/20 text-4xl"
      >
        <FaStethoscope />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-20 text-primary/15 text-5xl"
      >
        <FaHeartbeat />
      </motion.div>
    </section>
  );
};

export default HeroSection;
