import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const DoctorAppointmentsList = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <Card key={apt._id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {apt.patientId?.profilePicture ? (
                    <img
                      src={apt.patientId.profilePicture}
                      alt="Patient"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">
                      {apt.patientId?.firstName} {apt.patientId?.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {apt.patientId?.phoneNumber}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {apt.appointmentDate?.slice(0, 10)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {apt.startTime} - {apt.endTime}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsList;
