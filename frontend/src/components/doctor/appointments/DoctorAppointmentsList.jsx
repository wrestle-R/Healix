import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Droplet, Venus, Cake, Video, ExternalLink } from "lucide-react";
import PatientDetailsModal from "@/components/patient/PatientDetailsModal";
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

const checkAppointmentStatus = (appointmentDate, startTime, endTime, currentStatus) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const aptDate = appointmentDate?.slice(0, 10);
  
  // Only update if appointment is today
  if (aptDate === today) {
    if (currentStatus === 'pending' && currentTime >= startTime) {
      return 'ongoing';
    } else if (currentStatus === 'ongoing' && currentTime >= endTime) {
      return 'completed';
    }
  }
  
  return currentStatus;
};

const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/api/appointments/${appointmentId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
  }
};

const DoctorAppointmentsList = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPatientModal, setShowPatientModal] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/appointments/doctor/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    
    if (data.success) {
      // Check and update appointment statuses
      const updatedAppointments = [];
      for (const apt of data.appointments) {
        const newStatus = checkAppointmentStatus(
          apt.appointmentDate,
          apt.startTime,
          apt.endTime,
          apt.status
        );
        
        if (newStatus !== apt.status) {
          await updateAppointmentStatus(apt._id, newStatus);
          apt.status = newStatus;
        }
        
        updatedAppointments.push(apt);
      }
      
      setAppointments(updatedAppointments);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    
    // Set up interval to check for status updates every 10 minutes
    const interval = setInterval(() => {
      fetchAppointments();
    }, 600000); // Check every 10 minutes (10 * 60 * 1000 milliseconds)
    
    return () => clearInterval(interval);
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
        <Button 
          variant="outline" 
          onClick={fetchAppointments}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      {appointments.length === 0 ? (
        <div className="text-muted-foreground">No appointments found.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {appointments.map((apt) => {
            const patient = apt.patientId;
            return (
              <Card
                key={apt._id}
                className={`shadow-lg border transition ${
                  apt.status === 'ongoing' 
                    ? 'border-green-300 bg-green-50' 
                    : apt.status === 'completed'
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-blue-100 hover:border-blue-300'
                }`}
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
                          apt.status === "ongoing"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : apt.status === "completed"
                            ? "bg-gray-100 text-gray-700"
                            : apt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    
                    {/* Video Call Room URL - Show only when ongoing */}
                    {apt.status === 'ongoing' && apt.roomUrl && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="w-5 h-5" />
                          <span className="font-semibold">Consultation Room</span>
                        </div>
                        <Button
                          variant="secondary"
                          className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium"
                          onClick={() => window.open(apt.roomUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Join Video Call
                        </Button>
                      </div>
                    )}
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
