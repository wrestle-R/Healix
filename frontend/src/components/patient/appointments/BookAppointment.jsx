import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Star, Search, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const BookAppointment = () => {
  const { user } = useUser();
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingData, setBookingData] = useState({
    reasonForVisit: "",
    symptoms: [],
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSlotsModal, setSlotsModal] = useState(false);

  useEffect(() => {
    fetchSpecializations();
    fetchCities();
    searchDoctors();
    // eslint-disable-next-line
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

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await fetch(
        `${API_URL}/api/availability/${doctorId}/slots?date=${date}`
      );
      const data = await response.json();
      if (data.success) setAvailableSlots(data.slots || []);
    } catch (error) {
      setAvailableSlots([]);
      toast.error("Failed to fetch slots");
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
    if (filters.date) {
      fetchAvailableSlots(doctor._id, filters.date);
      setSlotsModal(true);
    } else {
      setSlotsModal(true);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
    setSlotsModal(false);
  };

  const handleBookingSubmit = async () => {
    if (!selectedDoctor || !selectedSlot || !user) return;
    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: user.id,
        appointmentDate: filters.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        reasonForVisit: bookingData.reasonForVisit,
        symptoms: bookingData.symptoms,
      };
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Appointment booked successfully!");
        setShowBookingModal(false);
        setSelectedDoctor(null);
        setSelectedSlot(null);
        setBookingData({ reasonForVisit: "", symptoms: [] });
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
              className="hover:shadow-lg transition-shadow bg-background/80"
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
                  <Button onClick={() => handleBookAppointment(doctor)}>
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

      {/* Time Slots Modal */}
      {showSlotsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Select Time Slot
            </h3>
            {!filters.date && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    handleFilterChange("date", e.target.value);
                    if (selectedDoctor) {
                      fetchAvailableSlots(selectedDoctor._id, e.target.value);
                    }
                  }}
                />
              </div>
            )}
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleSlotSelect(slot)}
                    className="text-sm"
                  >
                    {formatTime(slot.startTime)}
                  </Button>
                ))}
              </div>
            ) : filters.date ? (
              <p className="text-muted-foreground mb-4">
                No available slots for this date.
              </p>
            ) : null}
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setSlotsModal(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md border border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Booking Details
            </h3>
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
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      symptoms: e.target.value
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
              <p className="text-sm text-muted-foreground">
                Doctor: Dr. {selectedDoctor?.firstName}{" "}
                {selectedDoctor?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {filters.date}
              </p>
              <p className="text-sm text-muted-foreground">
                Time: {selectedSlot && formatTime(selectedSlot.startTime)}
              </p>
              <p className="text-sm font-medium text-green-600">
                Fee: ₹{selectedDoctor?.consultationFee}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowBookingModal(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookingSubmit}
                disabled={!bookingData.reasonForVisit}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
