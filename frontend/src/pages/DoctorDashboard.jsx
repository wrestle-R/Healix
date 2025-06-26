import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, onAuthStateChanged, auth } from "../../firebase.config.js";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FaUsers,
  FaCalendarCheck,
  FaPrescriptionBottleAlt,
  FaStar,
  FaClock,
  FaUserMd,
  FaChartLine,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";
import { toast } from "sonner";

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user: contextUser, logout } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
    { id: "patients", label: "Patients", icon: FaUsers },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: FaPrescriptionBottleAlt,
    },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
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
          {/* Sidebar */}
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
            {/* Welcome Section */}
            <motion.div variants={itemVariants}>
              <Card className="bg-background/50 backdrop-blur-sm border-border/50">
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
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 rounded-full bg-green-100 text-green-600 mr-3 md:mr-4">
                        <FaUsers className="h-4 w-4 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Total Patients
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          48
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600 mr-3 md:mr-4">
                        <FaCalendarCheck className="h-4 w-4 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Today's Appointments
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          12
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 rounded-full bg-purple-100 text-purple-600 mr-3 md:mr-4">
                        <FaPrescriptionBottleAlt className="h-4 w-4 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Prescriptions
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          24
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center">
                      <div className="p-2 md:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3 md:mr-4">
                        <FaStar className="h-4 w-4 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground">
                          Rating
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">
                          4.8
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl md:text-2xl font-serif">
                      <FaClock className="mr-3 h-5 w-5 md:h-6 md:w-6 text-primary" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>
                      Your appointments for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-full mr-3 md:mr-4">
                        <span className="text-xs md:text-sm font-semibold">
                          9AM
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          John Smith
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          General Checkup
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Confirmed
                      </Badge>
                    </div>

                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full mr-3 md:mr-4">
                        <span className="text-xs md:text-sm font-semibold">
                          10AM
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          Sarah Johnson
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Follow-up
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Confirmed
                      </Badge>
                    </div>

                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-100 text-purple-600 rounded-full mr-3 md:mr-4">
                        <span className="text-xs md:text-sm font-semibold">
                          11AM
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          Mike Wilson
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Consultation
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    </div>

                    <Separator />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full" variant="outline" size="sm">
                        <FaCalendarCheck className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        View All Appointments
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Patients */}
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl md:text-2xl font-serif">
                      <FaUserMd className="mr-3 h-5 w-5 md:h-6 md:w-6 text-primary" />
                      Recent Patients
                    </CardTitle>
                    <CardDescription>Recently visited patients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          John Smith
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Last visit: 2 days ago
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Stable
                      </Badge>
                    </div>

                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          SJ
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          Sarah Johnson
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Last visit: 1 week ago
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Follow-up
                      </Badge>
                    </div>

                    <div className="flex items-center p-3 md:p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <Avatar className="h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          MW
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">
                          Mike Wilson
                        </h4>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Last visit: 3 days ago
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Recovered
                      </Badge>
                    </div>

                    <Separator />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full" variant="outline" size="sm">
                        <FaChartLine className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        View Patient Records
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl font-serif">
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Frequently used features and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full h-auto p-3 md:p-4 flex flex-col items-center space-y-2"
                        variant="outline"
                        size="sm"
                      >
                        <FaCalendarCheck className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-xs md:text-sm">
                          Schedule Appointment
                        </span>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full h-auto p-3 md:p-4 flex flex-col items-center space-y-2"
                        variant="outline"
                        size="sm"
                      >
                        <FaPrescriptionBottleAlt className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-xs md:text-sm">
                          Create Prescription
                        </span>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full h-auto p-3 md:p-4 flex flex-col items-center space-y-2"
                        variant="outline"
                        size="sm"
                      >
                        <FaChartLine className="h-5 w-5 md:h-6 md:w-6" />
                        <span className="text-xs md:text-sm">
                          View Analytics
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
