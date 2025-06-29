import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X, CalendarPlus } from "lucide-react";
import CalendarSlotPicker from "./CalendarSlotPicker";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const BookAppointmentModal = ({ open, onClose, doctor, user }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({
    reasonForVisit: "",
    symptoms: [],
  });
  const [loading, setLoading] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState("");

  // Reset state when modal is closed or doctor changes
  useEffect(() => {
    if (!open) {
      setSelectedSlot(null);
      setBookingData({ reasonForVisit: "", symptoms: [] });
      setSymptomsInput("");
    } else if (bookingData.symptoms.length) {
      setSymptomsInput(bookingData.symptoms.join(", "));
    }
  }, [open, doctor]);

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !bookingData.reasonForVisit) return;
    
    // Validate that the selected slot is not in the past
    const slotDateTime = new Date(`${selectedSlot.date}T${selectedSlot.startTime}`);
    const now = new Date();
    
    if (slotDateTime <= now) {
      toast.error("Cannot book appointments for past dates or times");
      setSelectedSlot(null);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          patientId: user.id,
          appointmentDate: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          reasonForVisit: bookingData.reasonForVisit,
          symptoms: bookingData.symptoms,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Appointment booked successfully!");
        setSelectedSlot(null);
        setBookingData({ reasonForVisit: "", symptoms: [] });
        setSymptomsInput("");
        onClose();
        
        // Add to Google Calendar after successful booking
        addToGoogleCalendar();
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      toast.error("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const addToGoogleCalendar = () => {
    if (!selectedSlot) return;

    // Format the date and time for Google Calendar
    const formatDateTime = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split('-');
      const [hours, minutes] = timeStr.split(':');
      const date = new Date(year, month - 1, day, hours, minutes);
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };

    const startDateTime = formatDateTime(selectedSlot.date, selectedSlot.startTime);
    const endDateTime = formatDateTime(selectedSlot.date, selectedSlot.endTime);

    const eventDetails = {
      title: `Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`,
      location: doctor.clinicAddress || "Clinic",
      details: `Reason: ${bookingData.reasonForVisit}\nSymptoms: ${bookingData.symptoms.join(', ') || 'None'}`,
      start: startDateTime,
      end: endDateTime
    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(eventDetails.title)}` +
      `&dates=${eventDetails.start}/${eventDetails.end}` +
      `&details=${encodeURIComponent(eventDetails.details)}` +
      `&location=${encodeURIComponent(eventDetails.location)}`;

    window.open(url, '_blank');
  };

  // Format time for summary
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8">
              <Dialog.Title className="text-xl font-bold mb-6">
                Book Appointment
                {doctor
                  ? ` with Dr. ${doctor.firstName} ${doctor.lastName}`
                  : ""}
              </Dialog.Title>

              {/* Calendar and slot picker */}
              {!selectedSlot && doctor && (
                <CalendarSlotPicker
                  doctorId={doctor._id}
                  value={selectedSlot}
                  onChange={setSelectedSlot}
                />
              )}

              {/* Show booking details form if slot is selected */}
              {selectedSlot && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2 text-foreground">
                    Booking Details
                  </h4>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Reason for Visit *
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        rows="3"
                        placeholder="Brief description of your concern..."
                        value={bookingData.reasonForVisit}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            reasonForVisit: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Symptoms (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        placeholder="Comma-separated symptoms..."
                        value={symptomsInput}
                        onChange={(e) => setSymptomsInput(e.target.value)}
                        onBlur={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            symptoms: symptomsInput
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <h4 className="font-medium mb-2 text-foreground">
                      Appointment Summary
                    </h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      Doctor: Dr. {doctor?.firstName} {doctor?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Date: {selectedSlot?.date}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Time:{" "}
                      {selectedSlot?.startTime &&
                        formatTime(selectedSlot.startTime)}
                      {selectedSlot?.endTime
                        ? ` - ${formatTime(selectedSlot.endTime)}`
                        : ""}
                    </p>
                    <p className="text-sm font-medium text-green-600 mb-1">
                      Fee: ₹{doctor?.consultationFee}
                    </p>
                    <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                      <CalendarPlus className="w-4 h-4" />
                      You'll have the option to add this to Google Calendar after booking
                    </p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedSlot(null)}
                      className="text-muted-foreground"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={!bookingData.reasonForVisit || loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Booking...
                        </span>
                      ) : (
                        "Book Appointment"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookAppointmentModal;