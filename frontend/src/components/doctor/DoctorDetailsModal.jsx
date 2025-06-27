import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  X,
  GraduationCap,
  Hospital,
  MapPin,
  Mail,
  Phone,
  Star,
  User,
  Shield,
  Layers,
  Building2,
} from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm py-1">
    {Icon && <Icon className="w-4 h-4 text-primary" />}
    <span className="font-medium">{label}:</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

const DoctorDetailsModal = ({ open, onClose, doctor, onBook }) => {
  if (!doctor) return null;

  const validHospitalAffiliations = Array.isArray(doctor.hospitalAffiliations)
    ? doctor.hospitalAffiliations.filter(
        (hosp) =>
          hosp && (hosp.name || hosp.position || hosp.address || hosp.phone)
      )
    : [];

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
                    {doctor.profilePicture ? (
                      <img
                        src={doctor.profilePicture}
                        alt="Doctor"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="w-12 h-12 text-primary" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-2xl font-bold text-center md:text-left">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <div className="flex flex-wrap gap-1 justify-center md:justify-start mt-1">
                    {doctor.specializations?.map((spec, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  {/* Sub-Specializations */}
                  {doctor.subSpecializations?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {doctor.subSpecializations.map((sub, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-blue-400 text-blue-700"
                        >
                          <Layers className="w-3 h-3 mr-1 inline" /> {sub}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {/* Total Patients & Appointments */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" /> Patients:{" "}
                      {doctor.totalPatients || 0}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="w-4 h-4" /> Appointments:{" "}
                      {doctor.totalAppointments || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">
                      {doctor.averageRating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({doctor.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
                {/* Right: Details */}
                <div className="flex-1">
                  <section className="space-y-1">
                    <InfoRow
                      icon={GraduationCap}
                      label="Experience"
                      value={`${doctor.yearsOfExperience} years`}
                    />
                    <InfoRow icon={User} label="Gender" value={doctor.gender} />
                    <InfoRow icon={Mail} label="Email" value={doctor.email} />
                    <InfoRow
                      icon={Phone}
                      label="Phone"
                      value={doctor.phoneNumber}
                    />
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                      value={[
                        doctor.address?.city,
                        doctor.address?.state,
                        doctor.address?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    />
                    {/* Show consultation fee only if present */}
                    {doctor.consultationFee && (
                      <InfoRow
                        label="Consultation Fee"
                        value={`₹${doctor.consultationFee}`}
                      />
                    )}
                    <InfoRow
                      label="Medical License"
                      value={doctor.medicalLicenseNumber}
                    />
                  </section>
                  {doctor.bio && (
                    <section className="mt-4">
                      <h3 className="font-semibold mb-1">About</h3>
                      <p className="text-sm text-muted-foreground">
                        {doctor.bio}
                      </p>
                    </section>
                  )}
                  {doctor.education?.length > 0 && (
                    <section className="mt-4">
                      <h3 className="font-semibold flex items-center gap-1 mb-1">
                        <GraduationCap className="w-4 h-4" /> Education
                      </h3>
                      <ul className="list-disc ml-6 text-sm text-muted-foreground">
                        {doctor.education.map((edu, idx) => (
                          <li key={idx}>
                            {edu.degree} - {edu.institution} ({edu.year})
                            {edu.specialization && `, ${edu.specialization}`}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {validHospitalAffiliations.length > 0 && (
                    <section className="mt-4">
                      <h3 className="font-semibold flex items-center gap-1 mb-1">
                        <Hospital className="w-4 h-4" /> Hospital Affiliations
                      </h3>
                      <ul className="list-disc ml-6 text-sm text-muted-foreground">
                        {validHospitalAffiliations.map((hosp, idx) => (
                          <li key={idx}>
                            {hosp.name}
                            {hosp.position && ` - ${hosp.position}`}
                            {hosp.address && `, ${hosp.address}`}
                            {hosp.phone && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({hosp.phone})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {doctor.clinicAddress?.name && (
                    <section className="mt-4">
                      <h3 className="font-semibold mb-1">Clinic</h3>
                      <p className="text-sm text-muted-foreground">
                        {doctor.clinicAddress.name}
                        {doctor.clinicAddress.street &&
                          `, ${doctor.clinicAddress.street}`}
                        {doctor.clinicAddress.city &&
                          `, ${doctor.clinicAddress.city}`}
                        {doctor.clinicAddress.state &&
                          `, ${doctor.clinicAddress.state}`}
                        {doctor.clinicAddress.phone && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({doctor.clinicAddress.phone})
                          </span>
                        )}
                      </p>
                    </section>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t px-8 py-4 bg-muted rounded-b-xl">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={onBook}>Book Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DoctorDetailsModal;
