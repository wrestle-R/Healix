import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Video, ExternalLink } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

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

const PatientAppointmentsList = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${API_URL}/api/appointments/patient/${user.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
    
    // Set up interval to check for status updates every minute
    const interval = setInterval(() => {
      fetchAppointments();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Appointments</h2>
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
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <Card 
              key={apt._id}
              className={`transition ${
                apt.status === 'ongoing' 
                  ? 'border-green-300 bg-green-50' 
                  : apt.status === 'completed'
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {apt.doctorId?.profilePicture ? (
                    <img
                      src={apt.doctorId.profilePicture}
                      alt="Doctor"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">
                      Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {apt.doctorId?.specializations?.join(", ")}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0 flex-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {apt.appointmentDate?.slice(0, 10)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {apt.startTime} - {apt.endTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {apt.doctorId?.address?.city}
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
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white w-full md:w-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5" />
                        <span className="font-semibold">Join Consultation</span>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsList;
