import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
  profilePicture: "",
  emergencyContacts: [
    {
      name: "",
      relationship: "",
      phoneNumber: "",
      email: "",
    },
  ],
  height: { value: "", unit: "cm" },
  weight: { value: "", unit: "kg" },
  medicalHistory: [
    {
      condition: "",
      diagnosedDate: "",
      status: "active",
      notes: "",
    },
  ],
  allergies: [
    {
      allergen: "",
      severity: "",
      reaction: "",
      notes: "",
    },
  ],
  currentMedications: [
    {
      name: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      prescribedBy: "",
      isActive: false,
      notes: "",
    },
  ],
  smokingStatus: "never",
  alcoholConsumption: "never",
  exerciseFrequency: "none",
  dietType: "vegetarian",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const maritalStatuses = ["single", "married", "divorced", "widowed"];
const genders = ["male", "female", "other", "prefer-not-to-say"];
const allergySeverities = ["mild", "moderate", "severe"];
const medicalStatuses = ["active", "resolved", "chronic"];

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
          medicalHistory:
            data.patient.medicalHistory?.length > 0
              ? data.patient.medicalHistory
              : initialState.medicalHistory,
          allergies:
            data.patient.allergies?.length > 0
              ? data.patient.allergies
              : initialState.allergies,
          currentMedications:
            data.patient.currentMedications?.length > 0
              ? data.patient.currentMedications
              : initialState.currentMedications,
        });
      }
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      setProfile((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Emergency Contacts
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

  // Medical History
  const handleMedicalHistoryChange = (idx, e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const arr = [...prev.medicalHistory];
      arr[idx][name] = value;
      return { ...prev, medicalHistory: arr };
    });
  };
  const addMedicalHistory = () => {
    setProfile((prev) => ({
      ...prev,
      medicalHistory: [
        ...prev.medicalHistory,
        { condition: "", diagnosedDate: "", status: "active", notes: "" },
      ],
    }));
  };
  const removeMedicalHistory = (idx) => {
    setProfile((prev) => {
      const arr = [...prev.medicalHistory];
      arr.splice(idx, 1);
      return { ...prev, medicalHistory: arr };
    });
  };

  // Allergies
  const handleAllergyChange = (idx, e) => {
    const { name, value } = e.target;
    setProfile((prev) => {
      const arr = [...prev.allergies];
      arr[idx][name] = value;
      return { ...prev, allergies: arr };
    });
  };
  const addAllergy = () => {
    setProfile((prev) => ({
      ...prev,
      allergies: [
        ...prev.allergies,
        { allergen: "", severity: "", reaction: "", notes: "" },
      ],
    }));
  };
  const removeAllergy = (idx) => {
    setProfile((prev) => {
      const arr = [...prev.allergies];
      arr.splice(idx, 1);
      return { ...prev, allergies: arr };
    });
  };

  // Current Medications
  const handleMedicationChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => {
      const arr = [...prev.currentMedications];
      arr[idx][name] = type === "checkbox" ? checked : value;
      return { ...prev, currentMedications: arr };
    });
  };
  const addMedication = () => {
    setProfile((prev) => ({
      ...prev,
      currentMedications: [
        ...prev.currentMedications,
        {
          name: "",
          dosage: "",
          frequency: "",
          startDate: "",
          endDate: "",
          prescribedBy: "",
          isActive: false,
          notes: "",
        },
      ],
    }));
  };
  const removeMedication = (idx) => {
    setProfile((prev) => {
      const arr = [...prev.currentMedications];
      arr.splice(idx, 1);
      return { ...prev, currentMedications: arr };
    });
  };

  const isProfileComplete = () => {
    return (
      profile.firstName &&
      profile.lastName &&
      profile.dateOfBirth &&
      profile.gender &&
      profile.bloodGroup &&
      profile.phoneNumber &&
      profile.height.value &&
      profile.weight.value &&
      Array.isArray(profile.emergencyContacts) &&
      profile.emergencyContacts.length > 0 &&
      profile.emergencyContacts.every(
        (c) => c.name && c.relationship && c.phoneNumber
      ) &&
      // Validate that all filled allergies have severity selected
      profile.allergies.every(
        (allergy) => !allergy.allergen || (allergy.allergen && allergy.severity)
      )
      // maritalStatus, address, and allergens are NOT required for completion
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

    const { _id, firebaseUid, createdAt, updatedAt, __v, ...safeProfile } =
      profile;

    safeProfile.allergies = (safeProfile.allergies || []).filter(
      (a) => a.allergen || a.severity || a.reaction || a.notes
    );

    if (
      !safeProfile.address?.street &&
      !safeProfile.address?.city &&
      !safeProfile.address?.state &&
      !safeProfile.address?.zipCode &&
      !safeProfile.address?.country
    ) {
      delete safeProfile.address;
    }

    if (!safeProfile.maritalStatus) {
      delete safeProfile.maritalStatus;
    }

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
      toast.success("Profile updated successfully!");
      await refetchUser();
      navigate("/patient-dashboard");
    } else {
      toast.error(data.message || "Failed to update profile");
    }
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
        <form onSubmit={handleSubmit} className="grid gap-4 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm mb-1">
                Blood Group <span className="text-red-500">*</span>
              </label>
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
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
            <div className="min-w-0">
              <label className="block text-sm mb-1">
                Height (cm) <span className="text-red-500">*</span>
              </label>
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
            <div className="min-w-0">
              <label className="block text-sm mb-1">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="min-w-0">
              <label className="block text-sm mb-1">Smoking Status</label>
              <select
                name="smokingStatus"
                className="w-full border rounded px-2 py-1"
                value={profile.smokingStatus}
                onChange={handleChange}
              >
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm mb-1">Alcohol Consumption</label>
              <select
                name="alcoholConsumption"
                className="w-full border rounded px-2 py-1"
                value={profile.alcoholConsumption}
                onChange={handleChange}
              >
                <option value="never">Never</option>
                <option value="occasionally">Occasionally</option>
                <option value="regularly">Regularly</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm mb-1">Exercise Frequency</label>
              <select
                name="exerciseFrequency"
                className="w-full border rounded px-2 py-1"
                value={profile.exerciseFrequency}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="rarely">Rarely</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm mb-1">Diet Type</label>
              <select
                name="dietType"
                className="w-full border rounded px-2 py-1"
                value={profile.dietType}
                onChange={handleChange}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          {/* Medical History */}
          <div>
            <label className="block text-sm mb-1">Medical History</label>
            {profile.medicalHistory.map((mh, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 mb-2 md:grid md:grid-cols-4 md:gap-2 md:items-center p-3 border border-border rounded-lg"
              >
                <input
                  type="text"
                  name="condition"
                  placeholder="Condition"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={mh.condition}
                  onChange={(e) => handleMedicalHistoryChange(idx, e)}
                />
                <input
                  type="date"
                  name="diagnosedDate"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={mh.diagnosedDate?.slice(0, 10) || ""}
                  onChange={(e) => handleMedicalHistoryChange(idx, e)}
                />
                <select
                  name="status"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={mh.status}
                  onChange={(e) => handleMedicalHistoryChange(idx, e)}
                >
                  {medicalStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={mh.notes}
                  onChange={(e) => handleMedicalHistoryChange(idx, e)}
                />
                {profile.medicalHistory.length > 1 && (
                  <div className="md:col-span-4 flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                      onClick={() => removeMedicalHistory(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMedicalHistory}
              className="mt-2"
            >
              Add Medical History
            </Button>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm mb-1">Allergies</label>
            {profile.allergies.map((al, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 mb-2 md:grid md:grid-cols-4 md:gap-2 md:items-center p-3 border border-border rounded-lg"
              >
                <input
                  type="text"
                  name="allergen"
                  placeholder="Allergen"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={al.allergen}
                  onChange={(e) => handleAllergyChange(idx, e)}
                />
                <select
                  name="severity"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={al.severity}
                  onChange={(e) => handleAllergyChange(idx, e)}
                >
                  <option value="" disabled>
                    Severity
                  </option>
                  {allergySeverities.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="reaction"
                  placeholder="Reaction"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={al.reaction}
                  onChange={(e) => handleAllergyChange(idx, e)}
                />
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={al.notes}
                  onChange={(e) => handleAllergyChange(idx, e)}
                />
                {profile.allergies.length > 1 && (
                  <div className="md:col-span-4 flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                      onClick={() => removeAllergy(idx)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAllergy}
              className="mt-2"
            >
              Add Allergy
            </Button>
          </div>

          {/* Emergency Contacts */}
          <div>
            <label className="block text-sm mb-1">
              Emergency Contacts <span className="text-red-500">*</span>
            </label>
            {profile.emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 mb-2 md:grid md:grid-cols-4 md:gap-2 md:items-center p-3 border border-border rounded-lg"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={contact.name}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="text"
                  name="relationship"
                  placeholder="Relationship"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={contact.relationship}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={contact.phoneNumber}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border rounded px-2 py-1 w-full md:w-auto"
                  value={contact.email}
                  onChange={(e) => handleEmergencyContactChange(idx, e)}
                />
                {profile.emergencyContacts.length > 1 && (
                  <div className="md:col-span-4 flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                      onClick={() => removeEmergencyContact(idx)}
                    >
                      Remove
                    </Button>
                  </div>
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
