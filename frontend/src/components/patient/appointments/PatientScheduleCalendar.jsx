import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { X, Clock, User, Calendar } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const localizer = momentLocalizer(moment);

const PatientScheduleCalendar = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);

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
        setAppointments(data.appointments);
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
            originalData: apt,
          }))
        );
      }
    };
    fetchAppointments();
  }, [user]);

  const handleSelectSlot = ({ start }) => {
    const selectedDateStr = moment(start).format("YYYY-MM-DD");
    const dayAppointments = appointments.filter(
      (apt) => apt.appointmentDate.slice(0, 10) === selectedDateStr
    );

    if (dayAppointments.length > 0) {
      setSelectedDate(start);
      setSelectedDayAppointments(dayAppointments);
      setShowModal(true);
    }
  };

  const handleSelectEvent = (event) => {
    const selectedDateStr = moment(event.start).format("YYYY-MM-DD");
    const dayAppointments = appointments.filter(
      (apt) => apt.appointmentDate.slice(0, 10) === selectedDateStr
    );

    setSelectedDate(event.start);
    setSelectedDayAppointments(dayAppointments);
    setShowModal(true);
  };

  const AppointmentModal = () => {
    if (!showModal) return null;

    // Sort appointments by start time
    const sortedAppointments = selectedDayAppointments.sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border/50">
          {/* Header */}
          <div className="bg-primary/5 border-b border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  {moment(selectedDate).format("MMMM DD, YYYY")}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 ml-13">
                  {sortedAppointments.length} appointment
                  {sortedAppointments.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full hover:bg-muted/80 flex items-center justify-center transition-colors group"
              >
                <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4">
              {sortedAppointments.map((apt, index) => (
                <div
                  key={apt._id}
                  className="group relative bg-card border border-border/40 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-primary/30"
                >
                  {/* Status indicator line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                      apt.status === "confirmed"
                        ? "bg-green-500"
                        : apt.status === "pending"
                        ? "bg-yellow-500"
                        : apt.status === "ongoing"
                        ? "bg-blue-500"
                        : apt.status === "completed"
                        ? "bg-gray-400"
                        : "bg-gray-300"
                    }`}
                  />

                  {/* Main content */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Time and status row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                              apt.status === "confirmed"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : apt.status === "pending"
                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                : apt.status === "ongoing"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : apt.status === "completed"
                                ? "bg-gray-50 text-gray-600 border border-gray-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            {moment(apt.startTime, "HH:mm").format("h:mm A")} -{" "}
                            {moment(apt.endTime, "HH:mm").format("h:mm A")}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : apt.status === "ongoing"
                              ? "bg-blue-100 text-blue-800"
                              : apt.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      {/* Doctor info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            Dr. {apt.doctorId?.firstName} {apt.doctorId?.lastName}
                          </h4>
                          {apt.doctorId?.specializations?.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {apt.doctorId.specializations.slice(0, 2).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reason */}
                      {apt.reasonForVisit && (
                        <div className="bg-muted/50 rounded-lg p-3 mt-3">
                          <p className="text-sm">
                            <span className="font-medium text-foreground">
                              Reason:
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {apt.reasonForVisit}
                            </span>
                          </p>
                        </div>
                      )}

                      {/* Ongoing indicator */}
                      {apt.status === "ongoing" && (
                        <div className="flex items-center gap-2 mt-3 text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-xs font-medium">
                            Currently in progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 p-6 bg-muted/20">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {sortedAppointments.length > 1 &&
                  "Scroll to see all appointments"}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.status === "confirmed"
                  ? "#34d399"
                  : event.status === "pending"
                  ? "#fbbf24"
                  : event.status === "ongoing"
                  ? "#3b82f6"
                  : "#d1d5db",
              color: "#111827",
              borderRadius: "6px",
              border: "none",
            },
          })}
        />
      </div>

      <AppointmentModal />
    </div>
  );
};

export default PatientScheduleCalendar;
