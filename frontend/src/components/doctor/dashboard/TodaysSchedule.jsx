import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, User, Video } from "lucide-react";

const TodaysSchedule = ({ appointments = [] }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-700 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled')
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5 text-primary" />
          Today's Schedule
          <Badge variant="secondary" className="ml-auto">
            {upcomingAppointments.length} remaining
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          upcomingAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={appointment.patientId?.profilePicture} />
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">
                    {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                  </p>
                  <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                  {appointment.status === 'ongoing' && appointment.roomUrl && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Video className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
                {appointment.reasonForVisit && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {appointment.reasonForVisit}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysSchedule;
