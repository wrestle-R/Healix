import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  Droplet,
  Venus,
  Shield,
  Pill,
  AlertTriangle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm py-1">
    {Icon && <Icon className="w-4 h-4 text-primary" />}
    <span className="font-medium">{label}:</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const PatientDetailsModal = ({ open, onClose, patient }) => {
  const [fullPatient, setFullPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !patient?._id) return;
    setLoading(true);
    const fetchPatient = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/patients/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setFullPatient(data.patient);
      setLoading(false);
    };
    fetchPatient();
  }, [open, patient]);

  if (!open) return null;

  const p = fullPatient || patient;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />
      {/* Modal Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-background rounded-xl shadow-2xl max-w-2xl w-full p-0 z-50 overflow-y-auto max-h-[90vh]">
          <Card className="rounded-xl border-0">
            <CardContent className="p-0">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col md:flex-row gap-8 p-8">
                {/* Left: Avatar & Basic Info */}
                <div className="flex flex-col items-center md:items-start md:w-1/3 gap-2">
                  <Avatar className="w-24 h-24 mb-2">
                    {p.profilePicture ? (
                      <img
                        src={p.profilePicture}
                        alt="Patient"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="w-12 h-12 text-primary" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-2xl font-bold text-center md:text-left">
                    {p.firstName} {p.lastName}
                  </h2>
                  <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
                    {p.dateOfBirth && (
                      <span className="flex items-center gap-1">
                        <Cake className="w-4 h-4" /> Age:{" "}
                        {getAge(p.dateOfBirth)}
                      </span>
                    )}
                    {p.gender && (
                      <span className="flex items-center gap-1">
                        <Venus className="w-4 h-4" /> Gender: {p.gender}
                      </span>
                    )}
                    {p.bloodGroup && (
                      <span className="flex items-center gap-1">
                        <Droplet className="w-4 h-4" /> Blood: {p.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
                {/* Right: Details */}
                <div className="flex-1 space-y-2">
                  {loading ? (
                    <div className="text-center text-muted-foreground py-8">
                      Loading...
                    </div>
                  ) : (
                    <>
                      <section className="space-y-1">
                        <InfoRow icon={Mail} label="Email" value={p.email} />
                        <InfoRow
                          icon={Phone}
                          label="Phone"
                          value={p.phoneNumber}
                        />
                        <InfoRow
                          icon={MapPin}
                          label="Location"
                          value={[
                            p.address?.street,
                            p.address?.city,
                            p.address?.state,
                            p.address?.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        />
                        {p.height?.value && (
                          <InfoRow
                            icon={Shield}
                            label="Height"
                            value={`${p.height.value} ${p.height.unit || "cm"}`}
                          />
                        )}
                        {p.weight?.value && (
                          <InfoRow
                            icon={Shield}
                            label="Weight"
                            value={`${p.weight.value} ${p.weight.unit || "kg"}`}
                          />
                        )}
                        {p.maritalStatus && (
                          <InfoRow
                            label="Marital Status"
                            value={p.maritalStatus}
                          />
                        )}
                        {p.smokingStatus && (
                          <InfoRow label="Smoking" value={p.smokingStatus} />
                        )}
                        {p.alcoholConsumption && (
                          <InfoRow
                            label="Alcohol"
                            value={p.alcoholConsumption}
                          />
                        )}
                        {p.exerciseFrequency && (
                          <InfoRow
                            label="Exercise"
                            value={p.exerciseFrequency}
                          />
                        )}
                        {p.dietType && (
                          <InfoRow label="Diet" value={p.dietType} />
                        )}
                      </section>
                      {Array.isArray(p.medicalHistory) &&
                        p.medicalHistory.length > 0 && (
                          <section>
                            <h3 className="font-semibold mb-1">
                              Medical History
                            </h3>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {p.medicalHistory.map((mh, idx) => (
                                <li key={idx}>
                                  {mh.condition}{" "}
                                  {mh.status && (
                                    <span className="text-xs">
                                      ({mh.status})
                                    </span>
                                  )}
                                  {mh.diagnosedDate && (
                                    <span className="text-xs ml-2">
                                      Diagnosed:{" "}
                                      {new Date(
                                        mh.diagnosedDate
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  {mh.notes && (
                                    <span className="block text-xs text-muted-foreground">
                                      {mh.notes}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                      {Array.isArray(p.allergies) && p.allergies.length > 0 && (
                        <section>
                          <h3 className="font-semibold mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />{" "}
                            Allergies
                          </h3>
                          <ul className="list-disc ml-5 text-sm text-muted-foreground">
                            {p.allergies.map((al, idx) => (
                              <li key={idx}>
                                {al.allergen}{" "}
                                {al.severity && (
                                  <span className="text-xs">
                                    ({al.severity})
                                  </span>
                                )}
                                {al.reaction && (
                                  <span className="text-xs ml-2">
                                    Reaction: {al.reaction}
                                  </span>
                                )}
                                {al.notes && (
                                  <span className="block text-xs text-muted-foreground">
                                    {al.notes}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                      {Array.isArray(p.currentMedications) &&
                        p.currentMedications.length > 0 && (
                          <section>
                            <h3 className="font-semibold mb-1 flex items-center gap-1">
                              <Pill className="w-4 h-4 text-blue-500" /> Current
                              Medications
                            </h3>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {p.currentMedications.map((med, idx) => (
                                <li key={idx}>
                                  {med.name} {med.dosage && `- ${med.dosage}`}
                                  {med.frequency && (
                                    <span className="text-xs ml-2">
                                      ({med.frequency})
                                    </span>
                                  )}
                                  {med.isActive === false && (
                                    <span className="text-xs ml-2 text-muted-foreground">
                                      (inactive)
                                    </span>
                                  )}
                                  {med.notes && (
                                    <span className="block text-xs text-muted-foreground">
                                      {med.notes}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                      {Array.isArray(p.emergencyContacts) &&
                        p.emergencyContacts.length > 0 && (
                          <section>
                            <h3 className="font-semibold mb-1">
                              Emergency Contacts
                            </h3>
                            <ul className="list-disc ml-5 text-sm text-muted-foreground">
                              {p.emergencyContacts.map((ec, idx) => (
                                <li key={idx}>
                                  {ec.name} ({ec.relationship}):{" "}
                                  {ec.phoneNumber}
                                  {ec.email && (
                                    <span className="text-xs ml-2">
                                      {ec.email}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t px-8 py-4 bg-muted rounded-b-xl">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PatientDetailsModal;
