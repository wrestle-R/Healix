const Appointment = require("../models/appointment");
const DoctorAvailability = require("../models/doctorAvailability");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");

class AppointmentController {
  // Get all appointments for a doctor
  static async getDoctorAppointments(req, res) {
    try {
      const { doctorId } = req.params;
      const { date, status } = req.query;

      let query = { doctorId };

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        query.appointmentDate = { $gte: startDate, $lt: endDate };
      }

      if (status) {
        query.status = status;
      }

      const appointments = await Appointment.find(query)
        .populate("patientId", "firstName lastName profilePicture phoneNumber")
        .sort({ appointmentDate: 1, startTime: 1 });

      res.json({ success: true, appointments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all appointments for a patient
  static async getPatientAppointments(req, res) {
    try {
      const { patientId } = req.params;
      const { status } = req.query;

      let query = { patientId };

      if (status) {
        query.status = status;
      }

      const appointments = await Appointment.find(query)
        .populate(
          "doctorId",
          "firstName lastName specializations profilePicture"
        )
        .sort({ appointmentDate: 1, startTime: 1 });

      res.json({ success: true, appointments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor's availability for a specific date range
  static async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const availability = await DoctorAvailability.findOne({ doctorId });

      if (!availability) {
        return res.status(404).json({
          success: false,
          message: "Doctor availability not found",
        });
      }

      const availableSlots = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfWeek = date.toLocaleDateString("en-US", {
          weekday: "lowercase",
        });
        const daySchedule = availability.weeklySchedule[dayOfWeek];

        if (daySchedule.isAvailable) {
          // Check for specific date overrides
          const specificDate = availability.specificDates.find(
            (sd) => sd.date.toDateString() === date.toDateString()
          );

          if (specificDate && !specificDate.isAvailable) {
            continue; // Skip this date
          }

          // Generate slots for this day
          const slots = availability.generateSlotsForDay(new Date(date));

          // Check for existing appointments
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);

          const existingAppointments = await Appointment.find({
            doctorId,
            appointmentDate: {
              $gte: dayStart,
              $lt: dayEnd,
            },
            status: { $in: ["confirmed", "pending"] },
          });

          // Filter out booked slots
          const availableSlotsForDay = slots.filter((slot) => {
            return !existingAppointments.some(
              (apt) =>
                apt.startTime === slot.startTime && apt.endTime === slot.endTime
            );
          });

          if (availableSlotsForDay.length > 0) {
            availableSlots.push({
              date: new Date(date),
              slots: availableSlotsForDay,
              fee: availability.consultationFee,
            });
          }
        }
      }

      res.json({ success: true, availableSlots });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Book an appointment
  static async bookAppointment(req, res) {
    try {
      const {
        doctorId,
        patientId,
        appointmentDate,
        startTime,
        endTime,
        reasonForVisit,
        symptoms,
      } = req.body;

      // Check if the slot is still available
      const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        status: { $in: ["confirmed", "pending"] },
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: "This time slot is no longer available",
        });
      }

      // Get doctor's consultation fee
      const availability = await DoctorAvailability.findOne({ doctorId });
      if (!availability) {
        return res.status(404).json({
          success: false,
          message: "Doctor availability not found",
        });
      }

      // Create new appointment
      const appointment = new Appointment({
        doctorId,
        patientId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        reasonForVisit,
        symptoms: symptoms || [],
        fee: availability.consultationFee,
        status: "pending", // Will be confirmed after payment
      });

      await appointment.save();

      // Populate the appointment with doctor and patient details
      await appointment.populate([
        { path: "doctorId", select: "firstName lastName specializations" },
        { path: "patientId", select: "firstName lastName phoneNumber" },
      ]);

      res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        appointment,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(req, res) {
    try {
      const { appointmentId } = req.params;
      const { status, doctorNotes, prescription } = req.body;

      const updateData = { status };

      if (doctorNotes) updateData.doctorNotes = doctorNotes;
      if (prescription) updateData.prescription = prescription;

      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true }
      ).populate([
        { path: "doctorId", select: "firstName lastName specializations" },
        { path: "patientId", select: "firstName lastName phoneNumber" },
      ]);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.json({ success: true, appointment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Cancel appointment
  static async cancelAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const { reason } = req.body;

      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          status: "cancelled",
          notes: reason || "Cancelled by user",
        },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.json({
        success: true,
        message: "Appointment cancelled successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get appointment details
  static async getAppointmentById(req, res) {
    try {
      const { appointmentId } = req.params;

      const appointment = await Appointment.findById(appointmentId)
        .populate(
          "doctorId",
          "firstName lastName specializations profilePicture phoneNumber"
        )
        .populate(
          "patientId",
          "firstName lastName profilePicture phoneNumber dateOfBirth gender"
        );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      res.json({ success: true, appointment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Search doctors by specialty and availability
  static async searchDoctors(req, res) {
    try {
      const { specialty, city, date, minRating } = req.query;

      let doctorQuery = {
        isVerified: true,
        accountStatus: "active",
      };

      if (specialty) {
        doctorQuery.specializations = { $in: [specialty] };
      }

      if (city) {
        doctorQuery["address.city"] = new RegExp(city, "i");
      }

      if (minRating) {
        doctorQuery.averageRating = { $gte: parseFloat(minRating) };
      }

      const doctors = await Doctor.find(doctorQuery)
        .select(
          "firstName lastName specializations averageRating totalReviews profilePicture address"
        )
        .sort({ averageRating: -1 });

      // If date is provided, filter by availability
      if (date && doctors.length > 0) {
        const availableDoctors = [];

        for (const doctor of doctors) {
          const availability = await DoctorAvailability.findOne({
            doctorId: doctor._id,
          });

          if (availability) {
            const requestedDate = new Date(date);
            const dayOfWeek = requestedDate.toLocaleDateString("en-US", {
              weekday: "lowercase",
            });
            const daySchedule = availability.weeklySchedule[dayOfWeek];

            if (daySchedule && daySchedule.isAvailable) {
              // Check if there are available slots
              const slots = availability.generateSlotsForDay(requestedDate);
              const existingAppointments = await Appointment.find({
                doctorId: doctor._id,
                appointmentDate: requestedDate,
                status: { $in: ["confirmed", "pending"] },
              });

              const availableSlots = slots.filter((slot) => {
                return !existingAppointments.some(
                  (apt) => apt.startTime === slot.startTime
                );
              });

              if (availableSlots.length > 0) {
                availableDoctors.push({
                  ...doctor.toObject(),
                  availableSlots: availableSlots.length,
                  consultationFee: availability.consultationFee,
                });
              }
            }
          }
        }

        return res.json({ success: true, doctors: availableDoctors });
      }

      res.json({ success: true, doctors });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AppointmentController;
