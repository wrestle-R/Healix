import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DoctorAvailabilitySettings = () => {
  const { user } = useUser();
  const [schedule, setSchedule] = useState({});
  const [fee, setFee] = useState(500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAvailability = async () => {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/availability/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setSchedule(data.availability.weeklySchedule);
        setFee(data.availability.consultationFee);
      }
      setLoading(false);
    };
    fetchAvailability();
  }, [user]);

  const handleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/availability/${user.id}/schedule`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        weeklySchedule: schedule,
        consultationFee: fee,
      }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Availability updated!");
    } else {
      toast.error(data.message || "Failed to update availability");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">My Weekly Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((day) => (
            <div key={day} className="border rounded-md p-4 bg-muted">
              <div className="flex items-center mb-2">
                <span className="capitalize font-semibold">{day}</span>
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={schedule[day]?.isAvailable || false}
                  onChange={(e) =>
                    handleChange(day, "isAvailable", e.target.checked)
                  }
                />
                <span className="ml-2 text-xs text-muted-foreground">
                  Available
                </span>
              </div>
              {schedule[day]?.isAvailable && (
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="text-xs">Start Time</label>
                    <input
                      type="time"
                      className="ml-2"
                      value={schedule[day]?.startTime || ""}
                      onChange={(e) =>
                        handleChange(day, "startTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs">End Time</label>
                    <input
                      type="time"
                      className="ml-2"
                      value={schedule[day]?.endTime || ""}
                      onChange={(e) =>
                        handleChange(day, "endTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs">Break Start</label>
                    <input
                      type="time"
                      className="ml-2"
                      value={schedule[day]?.breakStartTime || ""}
                      onChange={(e) =>
                        handleChange(day, "breakStartTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs">Break End</label>
                    <input
                      type="time"
                      className="ml-2"
                      value={schedule[day]?.breakEndTime || ""}
                      onChange={(e) =>
                        handleChange(day, "breakEndTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs">Slot Duration (min)</label>
                    <input
                      type="number"
                      className="ml-2 w-16"
                      value={schedule[day]?.slotDuration || 30}
                      min={5}
                      max={120}
                      onChange={(e) =>
                        handleChange(
                          day,
                          "slotDuration",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <label className="font-medium">Consultation Fee (₹)</label>
          <input
            type="number"
            className="border rounded px-2 py-1 w-24"
            value={fee}
            min={0}
            onChange={(e) => setFee(Number(e.target.value))}
          />
        </div>
        <Button className="mt-6" onClick={handleSave}>
          Save Availability
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorAvailabilitySettings;
