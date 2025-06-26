import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "react-icons/fa";
import { useUser } from "../context/UserContext.jsx";
import { toast } from "sonner";

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-background">
      {/* Doctor Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary font-sans">
              Healix
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#dashboard"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Dashboard
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#appointments"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Appointments
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#patients"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Patients
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#prescriptions"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Prescriptions
              </motion.a>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={contextUser?.profilePicture}
                        alt={contextUser?.name}
                      />
                      <AvatarFallback className="font-semibold">
                        {contextUser?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "D"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Dr. {contextUser?.name || "Doctor"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {contextUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FaUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FaCog className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-serif">
                  Welcome back, Dr. {contextUser?.name || "Doctor"}!
                </h1>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                      <FaUsers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Patients
                      </p>
                      <p className="text-2xl font-bold text-foreground">48</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <FaCalendarCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Today's Appointments
                      </p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                      <FaPrescriptionBottleAlt className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Prescriptions
                      </p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, transition: { duration: 0.3 } }}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                      <FaStar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Rating
                      </p>
                      <p className="text-2xl font-bold text-foreground">4.8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Today's Schedule */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-serif">
                    <FaClock className="mr-3 h-6 w-6 text-primary" />
                    Today's Schedule
                  </CardTitle>
                  <CardDescription>Your appointments for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mr-4">
                      <span className="text-sm font-semibold">9AM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        John Smith
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        General Checkup
                      </p>
                    </div>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>

                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mr-4">
                      <span className="text-sm font-semibold">10AM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        Sarah Johnson
                      </h4>
                      <p className="text-sm text-muted-foreground">Follow-up</p>
                    </div>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>

                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mr-4">
                      <span className="text-sm font-semibold">11AM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        Mike Wilson
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Consultation
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>

                  <Separator />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full" variant="outline">
                      <FaCalendarCheck className="mr-2 h-4 w-4" />
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
                  <CardTitle className="flex items-center text-2xl font-serif">
                    <FaUserMd className="mr-3 h-6 w-6 text-primary" />
                    Recent Patients
                  </CardTitle>
                  <CardDescription>Recently visited patients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        JS
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        John Smith
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Last visit: 2 days ago
                      </p>
                    </div>
                    <Badge variant="secondary">Stable</Badge>
                  </div>

                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        Sarah Johnson
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Last visit: 1 week ago
                      </p>
                    </div>
                    <Badge variant="secondary">Follow-up</Badge>
                  </div>

                  <div className="flex items-center p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        MW
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        Mike Wilson
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Last visit: 3 days ago
                      </p>
                    </div>
                    <Badge variant="secondary">Recovered</Badge>
                  </div>

                  <Separator />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full" variant="outline">
                      <FaChartLine className="mr-2 h-4 w-4" />
                      View Patient Records
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mt-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Frequently used features and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <FaCalendarCheck className="h-6 w-6" />
                      <span>Schedule Appointment</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <FaPrescriptionBottleAlt className="h-6 w-6" />
                      <span>Create Prescription</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2"
                      variant="outline"
                    >
                      <FaChartLine className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
