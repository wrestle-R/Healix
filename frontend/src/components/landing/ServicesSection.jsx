import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaStethoscope,
  FaAmbulance,
  FaPills,
  FaChartLine,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-serif">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed for your wellbeing
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
          {/* Large card - spans 2 columns */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-100 mb-4 text-blue-600 mx-auto">
                  <FaStethoscope className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  General Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Expert medical consultation with certified doctors. Get
                  comprehensive health assessments and personalized treatment
                  plans.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regular card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-red-100 mb-4 text-red-600 mx-auto">
                  <FaAmbulance className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  Emergency Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  24/7 emergency medical services and support
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regular card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-green-100 mb-4 text-green-600 mx-auto">
                  <FaPills className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  Prescription Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Digital prescription and medication tracking
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regular card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-purple-100 mb-4 text-purple-600 mx-auto">
                  <FaChartLine className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  Health Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Track your health metrics and progress
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Regular card */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-orange-100 mb-4 text-orange-600 mx-auto">
                  <FaShieldAlt className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  Preventive Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Regular checkups and health screenings
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wide card - spans 2 columns */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="text-center border border-border/40 hover:border-primary hover:shadow-lg transition-all duration-150 bg-background">
              <CardHeader className="text-center">
                <div className="inline-flex p-4 rounded-full bg-indigo-100 mb-4 text-indigo-600 mx-auto">
                  <FaClock className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Round-the-clock medical assistance with our dedicated support
                  team. Get help whenever you need it.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
