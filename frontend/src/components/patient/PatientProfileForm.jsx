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
  bloodGroup: "",
  maritalStatus: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  },
  height: { value: "", unit: "cm" },
  weight: { value: "", unit: "kg" },
  emergencyContacts: [
    {
      name: "",
      relationship: "",
      phoneNumber: "",
      email: "",
    },
  ],
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const maritalStatuses = ["single", "married", "divorced", "widowed"];

const genders = ["male", "female", "other", "prefer-not-to-say"];

const PatientProfileForm = () => {
  const { user, refetchUser } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/patients/firebase/${user.firebaseUid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success && data.patient) {
        // Ensure all fields exist
        setProfile({
          ...initialState,
          ...data.patient,
          address: { ...initialState.address, ...data.patient.address },
          height: { ...initialState.height, ...data.patient.height },
          weight: { ...initialState.weight, ...data.patient.weight },
          emergencyContacts:
            data.patient.emergencyContacts?.length > 0
              ? data.patient.emergencyContacts
              : initialState.emergencyContacts,
        });
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("height.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        height: { ...prev.height, [key]: value },
      }));
    } else if (name.startsWith("weight.")) {
      const key = name.split(".")[1];
      setProfile((prev) => ({
        ...prev,
        weight: { ...prev.weight, [key]: value },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEmergencyContactChange = (idx, e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const contacts = [...prev.emergencyContacts];
      contacts[idx][name] = value;
      return { ...prev, emergencyContacts: contacts };
    });
  };

  const addEmergencyContact = () => {
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { name: "", relationship: "", phoneNumber: "", email: "" },
      ],
    }));
  };

  const removeEmergencyContact = (idx) => {
    setProfile((prev) => {
      const contacts = [...prev.emergencyContacts];
      contacts.splice(idx, 1);
      return { ...prev, emergencyContacts: contacts };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    // Remove fields that should not be sent to backend
    const { _id, firebaseUid, createdAt, updatedAt, __v, ...safeProfile } =
      profile;

    const res = await fetch(
      `${API_URL}/api/patients/profile/${user.firebaseUid}`,
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
      await refetchUser(); // update context
      navigate("/patient-dashboard");
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
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Blood Group</label>
              <select
                name="bloodGroup"
                className="w-full border rounded px-2 py-1"
                value={profile.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Marital Status</label>
              <select
                name="maritalStatus"
                className="w-full border rounded px-2 py-1"
                value={profile.maritalStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {maritalStatuses.map((ms) => (
                  <option key={ms} value={ms}>
                    {ms.charAt(0).toUpperCase() + ms.slice(1)}
                  </option>
                ))}
              </select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                type="number"
                name="height.value"
                className="w-full border rounded px-2 py-1"
                value={profile.height?.value || ""}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight.value"
                className="w-full border rounded px-2 py-1"
                value={profile.weight?.value || ""}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Emergency Contacts</label>
            {profile.emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-2 mb-2 items-center"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="border rounded px-2 py-1 flex-1"
                  value={contact.name}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="text"
                  name="relationship"
                  placeholder="Relationship"
                  className="border rounded px-2 py-1 flex-1"
                  value={contact.relationship}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone"
                  className="border rounded px-2 py-1 flex-1"
                  value={contact.phoneNumber}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border rounded px-2 py-1 flex-1"
                  value={contact.email}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                />
                {profile.emergencyContacts.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEmergencyContact(idx)}
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
              onClick={addEmergencyContact}
              className="mt-2"
            >
              Add Contact
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

export default PatientProfileForm;
