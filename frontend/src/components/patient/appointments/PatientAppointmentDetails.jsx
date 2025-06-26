import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const PatientAppointmentDetails = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {appointment.doctorId?.profilePicture ? (
            <img
              src={appointment.doctorId.profilePicture}
              alt="Doctor"
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-7 h-7 text-blue-600" />
            </div>
          )}
          <div>
            <div className="font-semibold">
              Dr. {appointment.doctorId?.firstName}{" "}
              {appointment.doctorId?.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {appointment.doctorId?.specializations?.join(", ")}
            </div>
          </div>
        </div>
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          {appointment.appointmentDate?.slice(0, 10)}
        </div>
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-1" />
          {appointment.startTime} - {appointment.endTime}
        </div>
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-1" />
          {appointment.doctorId?.address?.city}
        </div>
        <div className="mb-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-700"
                : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {appointment.status}
          </span>
        </div>
        <div className="mt-4">
          <div className="font-medium">Reason for Visit:</div>
          <div className="text-sm">{appointment.reasonForVisit}</div>
        </div>
        {appointment.symptoms?.length > 0 && (
          <div className="mt-2">
            <div className="font-medium">Symptoms:</div>
            <div className="text-sm">{appointment.symptoms.join(", ")}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAppointmentDetails;
