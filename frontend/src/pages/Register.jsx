import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  provider,
  auth,
  updateProfile,
  signOut,
} from "../../firebase.config.js";
import { useUser } from "../context/UserContext.jsx";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FaGoogle,
  FaUser,
  FaUserMd,
  FaUserPlus,
  FaArrowLeft,
} from "react-icons/fa";

const Register = () => {
  const [userType, setUserType] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: contextLogin } = useUser();

  const createUserProfile = async (firebaseUser, userData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/api/auth/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName,
          email: firebaseUser.email,
          profilePicture: firebaseUser.photoURL || "",
          role: userData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile creation failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Profile creation error:", error);
      throw error;
    }
  };

  const handleAuthError = async (error) => {
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      setError(error.message);
      toast.error(error.message);
      console.error("Authentication error:", error);
    } catch (signOutError) {
      console.error("Error during signout:", signOutError);
      toast.error("An unexpected error occurred during cleanup");
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: name,
      });

      const profileData = await createUserProfile(firebaseUser, {
        name: name,
        role: userType,
      });

      contextLogin(profileData.user, profileData.token);

      toast.success("Account created successfully!");
      navigate(
        userType === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"
      );
    } catch (error) {
      console.error("Registration error:", error);
      await handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const profileData = await createUserProfile(firebaseUser, {
        role: userType,
      });

      contextLogin(profileData.user, profileData.token);

      toast.success("Account created successfully!");
      navigate(
        userType === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"
      );
    } catch (error) {
      console.error("Google registration error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign up was cancelled");
        setError("Sign up was cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked. Please allow popups and try again.");
        setError("Popup was blocked. Please allow popups and try again.");
      } else {
        await handleAuthError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "linear" }}
      className="min-h-screen bg-background flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-border/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground font-serif">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join Healix and start your healthcare journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs
              value={userType}
              onValueChange={setUserType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient" className="flex items-center">
                  <FaUser className="mr-2 h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center">
                  <FaUserMd className="mr-2 h-4 w-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-medium"
                disabled={loading}
              >
                {loading ? (
                  <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full inline-block" />
                ) : (
                  <FaUserPlus className="mr-2 h-4 w-4" />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full font-medium"
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Register;
