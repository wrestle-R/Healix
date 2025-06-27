import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Droplet, Venus, Cake } from "lucide-react";
import PatientDetailsModal from "@/components/patient/PatientDetailsModal";
import { MessageCircle } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const DoctorAppointmentsList = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPatientModal, setShowPatientModal] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/appointments/doctor/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAppointments(data.appointments);
      setLoading(false);
    };
    fetchAppointments();
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <div className="text-muted-foreground">No appointments found.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {appointments.map((apt) => {
            const patient = apt.patientId;
            return (
              <Card
                key={apt._id}
                className="shadow-lg border border-blue-100 hover:border-blue-300 transition"
              >
                <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
                  {/* Patient Info */}
                  <div className="flex items-center gap-5 min-w-[220px] flex-1">
                    {patient?.profilePicture ? (
                      <img
                        src={patient.profilePicture}
                        alt="Patient"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {patient?.firstName} {patient?.lastName}
                        {patient?.gender && (
                          <span title="Gender">
                            <Venus className="inline w-4 h-4 text-pink-500" />
                          </span>
                        )}
                      </div>
                      {/* Slot timings under name only for laptops */}
                      <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {apt.appointmentDate?.slice(0, 10)}
                        {/* Vertical separator for desktop */}
                        <span className="h-5 border-l border-muted-foreground mx-3" />
                        <Clock className="w-4 h-4 mr-1" />
                        {apt.startTime} - {apt.endTime}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        {patient?.dateOfBirth && (
                          <span className="flex items-center gap-1">
                            <Cake className="w-4 h-4" />{" "}
                            {getAge(patient.dateOfBirth)} yrs
                          </span>
                        )}
                        {patient?.bloodGroup && (
                          <span className="flex items-center gap-1">
                            <Droplet className="w-4 h-4" /> {patient.bloodGroup}
                          </span>
                        )}
                      </div>
                      {patient?.address?.city && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {patient.address.city}, {patient.address.state}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Appointment Info */}
                  <div className="flex flex-col md:items-end gap-2 flex-1">
                    {/* Hide slot timings here on desktop */}
                    <div className="flex items-center text-sm text-muted-foreground md:hidden">
                      <Calendar className="w-4 h-4 mr-1" />
                      {apt.appointmentDate?.slice(0, 10)}
                      <Clock className="w-4 h-4 ml-4 mr-1" />
                      {apt.startTime} - {apt.endTime}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Reason:</span>{" "}
                      {apt.reasonForVisit || (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : apt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 min-w-[120px] justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowPatientModal(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Implement chat logic here
                        alert("Chat feature coming soon!");
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <PatientDetailsModal
        open={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorAppointmentsList;
