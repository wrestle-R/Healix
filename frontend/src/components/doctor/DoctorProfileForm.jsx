import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
};

const DoctorProfileForm = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [specializationInput, setSpecializationInput] = useState("");
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

  const handleSpecializationAdd = () => {
    if (
      specializationInput &&
      !profile.specializations.includes(specializationInput)
    ) {
      setProfile((prev) => ({
        ...prev,
        specializations: [...prev.specializations, specializationInput],
      }));
      setSpecializationInput("");
    }
  };

  const handleSpecializationRemove = (spec) => {
    setProfile((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }));
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

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
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
              <label className="block text-sm mb-1">Last Name</label>
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
              <label className="block text-sm mb-1">Email</label>
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
              <label className="block text-sm mb-1">Phone Number</label>
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
              <label className="block text-sm mb-1">Date of Birth</label>
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
              <label className="block text-sm mb-1">Gender</label>
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
                Medical License Number
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
              <label className="block text-sm mb-1">Years of Experience</label>
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
              <label className="block text-sm mb-1">Street</label>
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
              <label className="block text-sm mb-1">City</label>
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
              <label className="block text-sm mb-1">State</label>
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
              <label className="block text-sm mb-1">ZIP Code</label>
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
          <div>
            <label className="block text-sm mb-1">Specializations</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                value={specializationInput}
                onChange={(e) => setSpecializationInput(e.target.value)}
                placeholder="Add specialization"
              />
              <Button
                type="button"
                onClick={handleSpecializationAdd}
                disabled={!specializationInput}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((spec) => (
                <span
                  key={spec}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center"
                >
                  {spec}
                  <button
                    type="button"
                    className="ml-1 text-red-500"
                    onClick={() => handleSpecializationRemove(spec)}
                  >
                    ×
                  </button>
                </span>
              ))}
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
            <label className="block text-sm mb-1">Education</label>
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
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorProfileForm;
