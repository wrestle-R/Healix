import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, onAuthStateChanged, auth } from "../../firebase.config.js";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FaUsers,
  FaCalendarCheck,
  FaPrescriptionBottleAlt,
  FaStar,
  FaChartLine,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaCalendarPlus,
  FaClock,
  FaUserMd,
} from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";
import { toast } from "sonner";

import DoctorAppointmentsList from "@/components/doctor/appointments/DoctorAppointmentsList";
import DoctorScheduleCalendar from "@/components/doctor/appointments/DoctorScheduleCalendar";
import DoctorProfileForm from "@/components/doctor/DoctorProfileForm";
import DoctorAvailabilitySettings from "@/components/doctor/appointments/DoctorAvailabilitySettings";

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user: contextUser, logout } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  // Block dashboard if profile is not complete
  useEffect(() => {
    if (contextUser && contextUser.profileCompleted === false) {
      navigate("/doctor-profile");
    }
  }, [contextUser, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { id: "appointments", label: "Appointments", icon: FaCalendarCheck },
    { id: "calendar", label: "Calendar", icon: FaCalendarPlus },
    { id: "availability", label: "Availability", icon: FaClock },
    { id: "profile", label: "Profile", icon: FaUser },
    // Add more as needed
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile Navbar */}
      <div className="lg:hidden bg-background border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary font-sans">
            Healix
          </div>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={contextUser?.profilePicture}
                alt={contextUser?.name}
              />
              <AvatarFallback className="text-sm font-semibold">
                {contextUser?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "D"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FaBars className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="hidden lg:flex w-64 bg-background rounded-xl shadow-lg border border-border/50 h-[95vh] sticky top-[2vh] flex-col z-30 m-4 ml-4"
        >
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="text-2xl font-bold text-primary font-sans mb-4">
              Healix
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={contextUser?.profilePicture}
                  alt={contextUser?.name}
                />
                <AvatarFallback className="font-semibold text-lg">
                  {contextUser?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Dr. {contextUser?.name || "Doctor"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {contextUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 flex-1">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          <Separator className="mx-4" />

          {/* Settings & Logout */}
          <div className="p-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("profile")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            >
              <FaUser className="h-5 w-5" />
              <span>Profile</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            >
              <FaCog className="h-5 w-5" />
              <span>Settings</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150"
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span>Log out</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-4 top-4 bottom-4 w-64 bg-background rounded-xl shadow-xl border border-border/50 z-50 flex flex-col"
              >
                {/* Mobile Header */}
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary font-sans">
                      Healix
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={contextUser?.profilePicture}
                        alt={contextUser?.name}
                      />
                      <AvatarFallback className="font-semibold text-lg">
                        {contextUser?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "D"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Dr. {contextUser?.name || "Doctor"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contextUser?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="p-4 flex-1">
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                          activeTab === item.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </nav>
                </div>

                <Separator className="mx-4" />

                {/* Mobile Settings & Logout */}
                <div className="p-4 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("profile")}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                  >
                    <FaUser className="h-5 w-5" />
                    <span>Profile</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                  >
                    <FaCog className="h-5 w-5" />
                    <span>Settings</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150"
                  >
                    <FaSignOutAlt className="h-5 w-5" />
                    <span>Log out</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto"
          >
            {/* Tab Content */}
            {activeTab === "dashboard" && (
              <motion.div variants={itemVariants}>
                <Card className="bg-background/50 backdrop-blur-sm border-border/50 mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-serif">
                          Welcome back, Dr. {contextUser?.name || "Doctor"}!
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                          Manage your patients and appointments with ease
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:block"
                      >
                        <Avatar className="h-12 w-12 md:h-16 md:w-16">
                          <AvatarImage
                            src={contextUser?.profilePicture}
                            alt={contextUser?.name}
                          />
                          <AvatarFallback className="text-lg md:text-xl font-semibold">
                            {contextUser?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "D"}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
                {/* You can add more dynamic stats or quick actions here if you want */}
              </motion.div>
            )}

            {activeTab === "appointments" && (
              <motion.div variants={itemVariants}>
                <DoctorAppointmentsList />
              </motion.div>
            )}

            {activeTab === "calendar" && (
              <motion.div variants={itemVariants}>
                <DoctorScheduleCalendar />
              </motion.div>
            )}

            {activeTab === "availability" && (
              <motion.div variants={itemVariants}>
                <DoctorAvailabilitySettings />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div variants={itemVariants}>
                <DoctorProfileForm />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
