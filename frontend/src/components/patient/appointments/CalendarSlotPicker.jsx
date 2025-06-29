import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

function formatTime(timeStr) {
  // Expects "HH:mm" or "HH:mm:ss"
  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(h), Number(m));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const CalendarSlotPicker = ({
  doctorId,
  value,
  onChange,
  className = "",
  disabled = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter out past time slots for today
  const filterPastSlots = (slots, selectedDate) => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    if (!isToday) return slots;

    const currentTime = today.getHours() * 60 + today.getMinutes();

    return slots.filter((slot) => {
      const [hours, minutes] = slot.startTime.split(":").map(Number);
      const slotTime = hours * 60 + minutes;
      return slotTime > currentTime;
    });
  };

  // Fetch slots for the selected date
  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    setLoading(true);
    fetch(
      `${API_URL}/api/availability/${doctorId}/slots?date=${format(
        selectedDate,
        "yyyy-MM-dd"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const rawSlots = data.success
          ? data.slots.map((slot) => ({ ...slot, date: dateStr }))
          : [];

        // Filter out past slots if it's today
        const filteredSlots = filterPastSlots(rawSlots, selectedDate);
        setSlots(filteredSlots);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [doctorId, selectedDate]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar column */}
        <div className="md:w-64">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-lg border bg-background"
            disabled={(date) => disabled || date < new Date(new Date().setHours(0, 0, 0, 0))}
            fromDate={new Date()}
          />
        </div>
        {/* Slots column */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 font-medium text-foreground">
            {selectedDate
              ? `Available Slots for ${format(selectedDate, "dd MMM yyyy")}`
              : "Select a date"}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-md" />
              ))}
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
              {slots.map((slot, idx) => (
                <Button
                  key={idx}
                  variant={value === slot ? "default" : "outline"}
                  className="mb-2 w-full"
                  onClick={() => onChange(slot)}
                  disabled={disabled}
                >
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm mt-2">
              No slots available for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSlotPicker;
