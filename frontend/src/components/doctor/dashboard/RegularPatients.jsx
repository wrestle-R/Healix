import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Cake, Droplet, Venus } from "lucide-react";

const RegularPatients = ({ patients = [], onViewDetails }) => {
  const getAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          Regular Patients
          <Badge variant="secondary" className="ml-auto">
            {patients.length} patients
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {patients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>No regular patients yet</p>
            <p className="text-xs mt-1">Patients with 2+ appointments will appear here</p>
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient._id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={patient.profilePicture} />
                <AvatarFallback className="text-lg">
                  {(patient.firstName?.[0] || '') + (patient.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {patient.appointmentCount} visits
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {patient.dateOfBirth && (
                    <span className="flex items-center gap-1">
                      <Cake className="w-3 h-3" />
                      {getAge(patient.dateOfBirth)} yrs
                    </span>
                  )}
                  {patient.gender && (
                    <span className="flex items-center gap-1">
                      <Venus className="w-3 h-3" />
                      {patient.gender}
                    </span>
                  )}
                  {patient.bloodGroup && (
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3 h-3" />
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>
                
                {patient.address?.city && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {patient.address.city}, {patient.address.state}
                  </p>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(patient)}
                className="shrink-0"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RegularPatients;
