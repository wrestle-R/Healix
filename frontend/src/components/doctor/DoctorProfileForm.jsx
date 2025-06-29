import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  },
  medicalLicenseNumber: "",
  specializations: [],
  yearsOfExperience: "",
  bio: "",
  education: [
    {
      degree: "",
      institution: "",
      year: "",
      specialization: "",
    },
  ],
  verificationDocuments: [],
  subSpecializations: [],
  hospitalAffiliations: [
    {
      name: "",
      position: "",
      address: "",
      phone: "",
    },
  ],
  clinicAddress: {
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  },
  averageRating: 0,
  totalReviews: 0,
  profileCompleted: false,
  totalPatients: 0,
  totalAppointments: 0,
};

const DoctorProfileForm = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [specializationInput, setSpecializationInput] = useState("");
  const [subSpecializationInput, setSubSpecializationInput] = useState("");
  const [hospitalAffiliations, setHospitalAffiliations] = useState(
    initialState.hospitalAffiliations
  );
  const [clinicAddress, setClinicAddress] = useState(
    initialState.clinicAddress
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/doctors/firebase/${user.firebaseUid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success && data.doctor) {
        setProfile({
          ...initialState,
          ...data.doctor,
          address: { ...initialState.address, ...data.doctor.address },
          education:
            data.doctor.education?.length > 0
              ? data.doctor.education
              : initialState.education,
          verificationDocuments: data.doctor.verificationDocuments || [],
        });
        setHospitalAffiliations(
          data.doctor.hospitalAffiliations?.length > 0
            ? data.doctor.hospitalAffiliations
            : initialState.hospitalAffiliations
        );
        setClinicAddress(
          data.doctor.clinicAddress
            ? { ...initialState.clinicAddress, ...data.doctor.clinicAddress }
            : initialState.clinicAddress
        );
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enhanced specialization handling with comma support
  const handleSpecializationKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addSpecialization();
    }
  };

  const addSpecialization = () => {
    const trimmedInput = specializationInput.trim().replace(/,$/, ""); // Remove trailing comma
    if (trimmedInput && !profile.specializations.includes(trimmedInput)) {
      setProfile((prev) => ({
        ...prev,
        specializations: [...prev.specializations, trimmedInput],
      }));
      setSpecializationInput("");
    }
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    // Check if comma was typed
    if (value.includes(",")) {
      const parts = value.split(",");
      const newSpecs = parts
        .slice(0, -1)
        .map((s) => s.trim())
        .filter((s) => s && !profile.specializations.includes(s));

      if (newSpecs.length > 0) {
        setProfile((prev) => ({
          ...prev,
          specializations: [...prev.specializations, ...newSpecs],
        }));
      }

      // Keep the text after the last comma
      setSpecializationInput(parts[parts.length - 1]);
    } else {
      setSpecializationInput(value);
    }
  };

  // Enhanced sub-specialization handling with comma support
  const handleSubSpecializationKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addSubSpecialization();
    }
  };

  const addSubSpecialization = () => {
    const trimmedInput = subSpecializationInput.trim().replace(/,$/, "");
    if (trimmedInput && !profile.subSpecializations.includes(trimmedInput)) {
      setProfile((prev) => ({
        ...prev,
        subSpecializations: [...prev.subSpecializations, trimmedInput],
      }));
      setSubSpecializationInput("");
    }
  };

  const handleSubSpecializationChange = (e) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const parts = value.split(",");
      const newSpecs = parts
        .slice(0, -1)
        .map((s) => s.trim())
        .filter((s) => s && !profile.subSpecializations.includes(s));

      if (newSpecs.length > 0) {
        setProfile((prev) => ({
          ...prev,
          subSpecializations: [...prev.subSpecializations, ...newSpecs],
        }));
      }

      setSubSpecializationInput(parts[parts.length - 1]);
    } else {
      setSubSpecializationInput(value);
    }
  };

  const handleEducationChange = (idx, e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const education = [...prev.education];
      education[idx][name] = value;
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", year: "", specialization: "" },
      ],
    }));
  };

  const removeEducation = (idx) => {
    setProfile((prev) => {
      const education = [...prev.education];
      education.splice(idx, 1);
      return { ...prev, education };
    });
  };

  const handleHospitalAffiliationChange = (idx, e) => {
    const { name, value } = e.target;
    setHospitalAffiliations((prev) => {
      const updated = [...prev];
      updated[idx][name] = value;
      return updated;
    });
  };

  const addHospitalAffiliation = () => {
    setHospitalAffiliations((prev) => [
      ...prev,
      { name: "", position: "", address: "", phone: "" },
    ]);
  };

  const removeHospitalAffiliation = (idx) => {
    setHospitalAffiliations((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  };

  const handleClinicAddressChange = (e) => {
    const { name, value } = e.target;
    setClinicAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a helper to check if all required fields are filled
  const isProfileComplete = () => {
    return (
      profile.firstName &&
      profile.lastName &&
      profile.email &&
      profile.phoneNumber &&
      profile.dateOfBirth &&
      profile.gender &&
      profile.address.street &&
      profile.address.city &&
      profile.address.state &&
      profile.address.zipCode &&
      profile.medicalLicenseNumber &&
      Array.isArray(profile.specializations) &&
      profile.specializations.length > 0 &&
      profile.yearsOfExperience !== "" &&
      Array.isArray(profile.education) &&
      profile.education.length > 0 &&
      profile.education.every(
        (edu) => edu.degree && edu.institution && edu.year
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isProfileComplete()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token");

    // Remove fields that should not be sent to backend
    const { _id, firebaseUid, createdAt, updatedAt, __v, ...safeProfile } =
      profile;

    // Attach new fields
    safeProfile.hospitalAffiliations = hospitalAffiliations;
    safeProfile.clinicAddress = clinicAddress;

    // Remove empty address if all fields are empty (optional, for consistency)
    if (
      !safeProfile.address?.street &&
      !safeProfile.address?.city &&
      !safeProfile.address?.state &&
      !safeProfile.address?.zipCode &&
      !safeProfile.address?.country
    ) {
      delete safeProfile.address;
    }

    const res = await fetch(
      `${API_URL}/api/doctors/profile/${user.firebaseUid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(safeProfile),
      }
    );
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      toast.success("Profile updated!");
      navigate("/doctor-dashboard");
    } else {
      toast.error(data.message || "Failed to update profile");
    }
  };

  const handleSpecializationRemove = (spec) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }));
  };

  const handleSubSpecializationRemove = (spec) => {
    setProfile((prev) => ({
      ...prev,
      subSpecializations: prev.subSpecializations.filter((s) => s !== spec),
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">My Profile</h2>
          {isProfileComplete() ? (
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              Profile Completed
            </Badge>
          ) : (
            <Badge className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              Complete Profile
            </Badge>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full border rounded px-2 py-1"
                value={profile.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full border rounded px-2 py-1"
                value={profile.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full border rounded px-2 py-1"
                value={profile.email}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full border rounded px-2 py-1"
                value={profile.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full border rounded px-2 py-1"
                value={profile.dateOfBirth?.slice(0, 10) || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                className="w-full border rounded px-2 py-1"
                value={profile.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">
                Medical License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="medicalLicenseNumber"
                className="w-full border rounded px-2 py-1"
                value={profile.medicalLicenseNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                className="w-full border rounded px-2 py-1"
                value={profile.yearsOfExperience}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm mb-1">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.street"
                className="w-full border rounded px-2 py-1"
                value={profile.address?.street || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.city"
                className="w-full border rounded px-2 py-1"
                value={profile.address?.city || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.state"
                className="w-full border rounded px-2 py-1"
                value={profile.address?.state || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.zipCode"
                className="w-full border rounded px-2 py-1"
                value={profile.address?.zipCode || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Specializations <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    value={specializationInput}
                    onChange={handleSpecializationChange}
                    onKeyDown={handleSpecializationKeyDown}
                    placeholder="Type specializations separated by commas..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addSpecialization}
                    disabled={!specializationInput.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <AnimatePresence mode="popLayout">
                    {profile.specializations.map((spec) => (
                      <motion.div
                        key={spec}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="group"
                      >
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-primary/20 transition-colors cursor-default"
                        >
                          <span>{spec}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                            onClick={() => handleSpecializationRemove(spec)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {profile.specializations.length === 0 && (
                    <div className="text-muted-foreground text-sm italic">
                      No specializations added yet
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Type your specializations and press comma or Enter to add them
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sub-Specializations
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    value={subSpecializationInput}
                    onChange={handleSubSpecializationChange}
                    onKeyDown={handleSubSpecializationKeyDown}
                    placeholder="Type sub-specializations separated by commas..."
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addSubSpecialization}
                    disabled={!subSpecializationInput.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                  <AnimatePresence mode="popLayout">
                    {profile.subSpecializations?.map((spec) => (
                      <motion.div
                        key={spec}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="group"
                      >
                        <Badge
                          variant="outline"
                          className="bg-secondary/10 text-secondary-foreground border border-secondary/30 px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-secondary/20 transition-colors cursor-default"
                        >
                          <span>{spec}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive rounded-full"
                            onClick={() => handleSubSpecializationRemove(spec)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {(!profile.subSpecializations ||
                    profile.subSpecializations.length === 0) && (
                    <div className="text-muted-foreground text-sm italic">
                      No sub-specializations added yet
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Type your sub-specializations and press comma or Enter to add
                  them
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              name="bio"
              className="w-full border rounded px-2 py-1"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">
              Education <span className="text-red-500">*</span>
            </label>
            {profile.education.map((edu, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-2 mb-2 items-center"
              >
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  className="border rounded px-2 py-1 flex-1"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  className="border rounded px-2 py-1 flex-1"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  type="number"
                  name="year"
                  placeholder="Year"
                  className="border rounded px-2 py-1 flex-1"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(idx, e)}
                  required
                />
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  className="border rounded px-2 py-1 flex-1"
                  value={edu.specialization}
                  onChange={(e) => handleEducationChange(idx, e)}
                />
                {profile.education.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(idx)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEducation}
              className="mt-2"
            >
              Add Education
            </Button>
          </div>
          <div>
            <label className="block text-sm mb-1">Hospital Affiliations</label>
            {hospitalAffiliations.map((aff, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-2 mb-2 items-center"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Hospital Name"
                  className="border rounded px-2 py-1 flex-1"
                  value={aff.name}
                  onChange={(e) => handleHospitalAffiliationChange(idx, e)}
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  className="border rounded px-2 py-1 flex-1"
                  value={aff.position}
                  onChange={(e) => handleHospitalAffiliationChange(idx, e)}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="border rounded px-2 py-1 flex-1"
                  value={aff.address}
                  onChange={(e) => handleHospitalAffiliationChange(idx, e)}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  className="border rounded px-2 py-1 flex-1"
                  value={aff.phone}
                  onChange={(e) => handleHospitalAffiliationChange(idx, e)}
                />
                {hospitalAffiliations.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeHospitalAffiliation(idx)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHospitalAffiliation}
              className="mt-2"
            >
              Add Hospital Affiliation
            </Button>
          </div>
          <div>
            <label className="block text-sm mb-1">Clinic Address</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                name="name"
                placeholder="Clinic Name"
                className="border rounded px-2 py-1"
                value={clinicAddress.name}
                onChange={handleClinicAddressChange}
              />
              <input
                type="text"
                name="street"
                placeholder="Street"
                className="border rounded px-2 py-1"
                value={clinicAddress.street}
                onChange={handleClinicAddressChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="border rounded px-2 py-1"
                value={clinicAddress.city}
                onChange={handleClinicAddressChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="border rounded px-2 py-1"
                value={clinicAddress.state}
                onChange={handleClinicAddressChange}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                className="border rounded px-2 py-1"
                value={clinicAddress.zipCode}
                onChange={handleClinicAddressChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="border rounded px-2 py-1"
                value={clinicAddress.phone}
                onChange={handleClinicAddressChange}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileForm;
