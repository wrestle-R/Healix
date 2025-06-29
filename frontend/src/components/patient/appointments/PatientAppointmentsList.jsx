import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, Video, ExternalLink, ChevronDown, ChevronUp, Archive, CheckCircle } from "lucide-react";
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
  const [showCompleted, setShowCompleted] = useState(false);

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

  // Separate appointments by status
  const activeAppointments = appointments.filter(apt => apt.status !== 'completed');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const AppointmentCard = ({ apt, isCompleted = false }) => (
    <Card 
      className={`transition-all duration-200 ${
        isCompleted
          ? 'border-gray-200 bg-gray-50/50 hover:shadow-md'
          : apt.status === 'ongoing' 
          ? 'border-green-300 bg-green-50 shadow-md' 
          : 'border-border hover:border-primary/30 hover:shadow-md'
      }`}
    >
      <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {apt.doctorId?.profilePicture ? (
            <img
              src={apt.doctorId.profilePicture}
              alt="Doctor"
              className={`w-16 h-16 rounded-full object-cover border-2 ${
                isCompleted ? 'border-gray-300' : 'border-primary/20'
              }`}
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              isCompleted 
                ? 'bg-gray-100 border-gray-300' 
                : 'bg-primary/10 border-primary/20'
            }`}>
              <User className={`w-8 h-8 ${isCompleted ? 'text-gray-500' : 'text-primary'}`} />
            </div>
          )}
          <div>
            <div className="font-semibold text-lg flex items-center gap-2">
              Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}
              {isCompleted && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {apt.doctorId?.specializations?.slice(0, 2).join(", ")}
            </div>
            {apt.doctorId?.address?.city && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {apt.doctorId.address.city}
              </div>
            )}
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
          
          {apt.reasonForVisit && (
            <div className="text-sm mt-1">
              <span className="font-medium">Reason:</span>{" "}
              {apt.reasonForVisit}
            </div>
          )}
          
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                apt.status === "ongoing"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : apt.status === "completed"
                  ? "bg-gray-100 text-gray-600 border border-gray-200"
                  : apt.status === "pending"
                  ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
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
  );

  return (
    <div className="space-y-8">
      {/* Active Appointments Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {activeAppointments.length} upcoming and ongoing appointments
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchAppointments}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {activeAppointments.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No active appointments</h3>
              <p className="text-sm text-muted-foreground text-center">
                You don't have any pending or ongoing appointments at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeAppointments.map((apt) => (
              <AppointmentCard key={apt._id} apt={apt} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Appointments Section */}
      {completedAppointments.length > 0 && (
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Archive className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Completed Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  {completedAppointments.length} completed consultation{completedAppointments.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2"
            >
              {showCompleted ? 'Hide' : 'Show'} Completed
              {showCompleted ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>

          {showCompleted && (
            <div className="grid gap-3">
              {completedAppointments.map((apt) => (
                <AppointmentCard key={apt._id} apt={apt} isCompleted={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsList;
