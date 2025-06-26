import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const API_URL = import.meta.env.VITE_API_URL;

const localizer = momentLocalizer(moment);

const PatientScheduleCalendar = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/appointments/patient/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setEvents(
          data.appointments.map((apt) => ({
            id: apt._id,
            title: `Dr. ${apt.doctorId?.firstName || ""} ${
              apt.doctorId?.lastName || ""
            }`,
            start: new Date(
              `${apt.appointmentDate.slice(0, 10)}T${apt.startTime}`
            ),
            end: new Date(`${apt.appointmentDate.slice(0, 10)}T${apt.endTime}`),
            status: apt.status,
          }))
        );
      }
    };
    fetchAppointments();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Appointment Calendar</h2>
      <div className="bg-white rounded shadow p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.status === "confirmed"
                  ? "#34d399"
                  : event.status === "pending"
                  ? "#fbbf24"
                  : "#d1d5db",
              color: "#111827",
              borderRadius: "6px",
              border: "none",
            },
          })}
        />
      </div>
    </div>
  );
};

export default PatientScheduleCalendar;
