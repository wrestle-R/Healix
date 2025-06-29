import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, onAuthStateChanged, auth } from "../../firebase.config.js";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaComments,
  FaChartBar,
} from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";
import { toast } from "sonner";

// Import your real components
import BookAppointment from "@/components/patient/appointments/BookAppointment";
import PatientAppointmentsList from "@/components/patient/appointments/PatientAppointmentsList";
import PatientProfileForm from "@/components/patient/PatientProfileForm";
import PatientScheduleCalendar from "@/components/patient/appointments/PatientScheduleCalendar";
import TalkingDoctorChatbot from "@/components/ChatBot/DoctorModel.jsx";
import Analytics from "@/components/patient/Analytics.jsx";

const PatientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [patientProfile, setPatientProfile] = useState(null);
  const navigate = useNavigate();
  const { user: contextUser, logout } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const url = `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/patients/firebase/${firebaseUser.uid}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatientProfile(res.data.patient);
      } catch (err) {
        console.error("Failed to fetch patient profile:", err);
        toast.error("Failed to fetch patient profile");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const displayFirstName = patientProfile?.firstName;
  const displayLastName = patientProfile?.lastName;
  const displayProfilePicture = patientProfile?.profilePicture;
  const displayEmail = patientProfile?.email;

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
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "chat", label: "Chat", icon: FaComments },
    { id: "analytics", label: "Analytics", icon: FaChartBar },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.22, ease: "easeOut" },
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
                src={displayProfilePicture}
                alt={`${displayFirstName} ${displayLastName}`}
              />
              <AvatarFallback className="text-sm font-semibold">
                {(displayFirstName?.[0] || "") + (displayLastName?.[0] || "") ||
                  "P"}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "linear" }}
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
                  src={displayProfilePicture}
                  alt={`${displayFirstName} ${displayLastName}`}
                />
                <AvatarFallback className="font-semibold text-lg">
                  {(displayFirstName?.[0] || "") +
                    (displayLastName?.[0] || "") || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayFirstName && displayLastName
                    ? `${displayFirstName} ${displayLastName}`
                    : "Patient"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {displayEmail}
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

          <Separator />

          {/* Settings & Logout */}
          <div className="p-4 space-y-2">
            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
            >
              <FaCog className="h-5 w-5" />
              <span>Settings</span>
            </motion.button> */}

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
                        src={displayProfilePicture}
                        alt={`${displayFirstName} ${displayLastName}`}
                      />
                      <AvatarFallback className="font-semibold text-lg">
                        {(displayFirstName?.[0] || "") +
                          (displayLastName?.[0] || "") || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {displayFirstName && displayLastName
                          ? `${displayFirstName} ${displayLastName}`
                          : "Patient"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {displayEmail}
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
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="space-y-6 max-w-7xl w-full mx-auto"
          >
            {/* Tab Content */}
            {activeTab === "dashboard" && (
              <motion.div variants={itemVariants}>
                <Card className="bg-background/50 backdrop-blur-sm border-border/50 mb-6 mx-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-serif">
                          Welcome back,{" "}
                          {displayFirstName && displayLastName
                            ? `${displayFirstName} ${displayLastName}`
                            : "Patient"}
                          !
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                          Take control of your health journey
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:block"
                      >
                        <Avatar className="h-12 w-12 md:h-16 md:w-16">
                          <AvatarImage
                            src={displayProfilePicture}
                            alt={`${displayFirstName} ${displayLastName}`}
                          />
                          <AvatarFallback className="text-lg md:text-xl font-semibold">
                            {(displayFirstName?.[0] || "") +
                              (displayLastName?.[0] || "") || "P"}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "appointments" && (
              <motion.div variants={itemVariants}>
                <PatientAppointmentsList />
              </motion.div>
            )}

            {activeTab === "calendar" && (
              <motion.div variants={itemVariants}>
                <PatientScheduleCalendar />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div variants={itemVariants}>
                <PatientProfileForm />
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div variants={itemVariants}>
                <div className="max-w-7xl w-full mx-auto">
                  <TalkingDoctorChatbot />
                </div>
              </motion.div>
            )}

            {/* Book Appointment Quick Action */}
            {activeTab === "dashboard" && (
              <motion.div variants={itemVariants}>
                <div className="max-w-7xl w-full mx-auto">
                  <BookAppointment user={contextUser} />
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div variants={itemVariants}>
                <Analytics/>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
