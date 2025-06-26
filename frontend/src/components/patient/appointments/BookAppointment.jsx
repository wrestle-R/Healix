import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import moment from "moment";
import DoctorDetailsModal from "@/components/doctor/DoctorDetailsModal";
import BookAppointmentModal from "./BookAppointmentModal";

const API_URL = import.meta.env.VITE_API_URL;

const BookAppointment = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: "",
    city: "",
    date: "",
    minRating: "",
    search: "",
  });
  const [specializations, setSpecializations] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    fetchSpecializations();
    fetchCities();
    searchDoctors();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/doctors/data/specializations`
      );
      const data = await response.json();
      if (data.success) setSpecializations(data.specializations);
    } catch (error) {
      toast.error("Failed to load specializations");
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors/data/cities`);
      const data = await response.json();
      if (data.success) setCities(data.cities);
    } catch (error) {
      toast.error("Failed to load cities");
    }
  };

  const searchDoctors = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      const response = await fetch(`${API_URL}/api/doctors?${queryParams}`);
      const data = await response.json();
      if (data.success) setDoctors(data.doctors);
    } catch (error) {
      toast.error("Failed to search doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    searchDoctors();
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleDoctorCardClick = async (doctorId) => {
    setShowDoctorModal(true);
    setDoctorDetails(null);
    try {
      const res = await fetch(`${API_URL}/api/doctors/${doctorId}/details`);
      const data = await res.json();
      if (data.success) setDoctorDetails(data.doctor);
      else toast.error("Failed to load doctor details");
    } catch {
      toast.error("Failed to load doctor details");
      setShowDoctorModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 font-serif">
        Find & Book Doctors
      </h1>

      {/* Search Filters */}
      <Card className="bg-background/50 backdrop-blur-sm border-border/50 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Doctor name, specialty..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Specialty
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                value={filters.specialty}
                onChange={(e) =>
                  handleFilterChange("specialty", e.target.value)
                }
              >
                <option value="">All Specialties</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                value={filters.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Rating
              </label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                value={filters.minRating}
                onChange={(e) =>
                  handleFilterChange("minRating", e.target.value)
                }
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>
          <Button onClick={handleSearch} className="w-full md:w-auto">
            Search Doctors
          </Button>
        </CardContent>
      </Card>

      {/* Doctor Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching doctors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              className="hover:shadow-lg transition-shadow bg-background/80 cursor-pointer"
              onClick={() => handleDoctorCardClick(doctor._id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-16 h-16">
                    {doctor.profilePicture ? (
                      <AvatarImage
                        src={doctor.profilePicture}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      />
                    ) : (
                      <AvatarFallback>
                        {doctor.firstName[0]}
                        {doctor.lastName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-primary">
                      {doctor.specializations.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {doctor.address?.city}, {doctor.address?.state}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    {doctor.averageRating.toFixed(1)} ({doctor.totalReviews}{" "}
                    reviews)
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {doctor.yearsOfExperience} years experience
                  </div>
                </div>
                {doctor.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {doctor.bio}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    ₹{doctor.consultationFee}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookAppointment(doctor);
                    }}
                  >
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {doctors.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No doctors found matching your criteria.
          </p>
        </div>
      )}

      {/* Doctor Details Modal */}
      <DoctorDetailsModal
        open={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        doctor={doctorDetails}
        onBook={() => {
          setShowDoctorModal(false);
          handleBookAppointment(doctorDetails);
        }}
      />

      {/* Only use the new modal below */}
      <BookAppointmentModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        doctor={selectedDoctor}
        user={user}
      />
    </div>
  );
};

export default BookAppointment;
