const DoctorAvailability = require("../models/doctorAvailability");
const Doctor = require("../models/doctor");

class DoctorAvailabilityController {
  // Get doctor's availability
  static async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;

      let availability = await DoctorAvailability.findOne({ doctorId });

      if (!availability) {
        // Create default availability if none exists
        availability = new DoctorAvailability({
          doctorId,
          weeklySchedule: {
            monday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
              breakStartTime: "13:00",
              breakEndTime: "14:00",
              slotDuration: 30,
            },
            tuesday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
              breakStartTime: "13:00",
              breakEndTime: "14:00",
              slotDuration: 30,
            },
            wednesday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
              breakStartTime: "13:00",
              breakEndTime: "14:00",
              slotDuration: 30,
            },
            thursday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
              breakStartTime: "13:00",
              breakEndTime: "14:00",
              slotDuration: 30,
            },
            friday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "17:00",
              breakStartTime: "13:00",
              breakEndTime: "14:00",
              slotDuration: 30,
            },
            saturday: {
              isAvailable: true,
              startTime: "09:00",
              endTime: "13:00",
              breakStartTime: "",
              breakEndTime: "",
              slotDuration: 30,
            },
            sunday: {
              isAvailable: false,
              startTime: "",
              endTime: "",
              breakStartTime: "",
              breakEndTime: "",
              slotDuration: 30,
            },
          },
          consultationFee: 500,
        });

        await availability.save();
      }

      res.json({ success: true, availability });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update weekly schedule
  static async updateWeeklySchedule(req, res) {
    try {
      const { doctorId } = req.params;
      const { weeklySchedule, consultationFee } = req.body;

      const availability = await DoctorAvailability.findOneAndUpdate(
        { doctorId },
        {
          weeklySchedule,
          consultationFee: consultationFee || 500,
        },
        { new: true, upsert: true }
      );

      res.json({ success: true, availability });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Set unavailable dates
  static async setUnavailableDates(req, res) {
    try {
      const { doctorId } = req.params;
      const { dates, reason } = req.body; // dates is an array of date strings

      const availability = await DoctorAvailability.findOne({ doctorId });

      if (!availability) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor availability not found" });
      }

      // Add unavailable dates
      dates.forEach((dateString) => {
        const date = new Date(dateString);
        const existingDateIndex = availability.specificDates.findIndex(
          (sd) => sd.date.toDateString() === date.toDateString()
        );

        if (existingDateIndex > -1) {
          // Update existing entry
          availability.specificDates[existingDateIndex].isAvailable = false;
          availability.specificDates[existingDateIndex].reason = reason;
        } else {
          // Add new entry
          availability.specificDates.push({
            date,
            isAvailable: false,
            reason,
            slots: [],
          });
        }
      });

      await availability.save();

      res.json({ success: true, availability });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Remove unavailable dates
  static async removeUnavailableDates(req, res) {
    try {
      const { doctorId } = req.params;
      const { dates } = req.body;

      const availability = await DoctorAvailability.findOne({ doctorId });

      if (!availability) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor availability not found" });
      }

      // Remove or update dates
      dates.forEach((dateString) => {
        const date = new Date(dateString);
        availability.specificDates = availability.specificDates.filter(
          (sd) => sd.date.toDateString() !== date.toDateString()
        );
      });

      await availability.save();

      res.json({ success: true, availability });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get available slots for a specific date
  static async getAvailableSlots(req, res) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      // Validate that the requested date is not in the past
      const requestedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (requestedDate < today) {
        return res.status(400).json({ 
          success: false, 
          message: "Cannot book appointments for past dates" 
        });
      }

      const availability = await DoctorAvailability.findOne({ doctorId });

      if (!availability) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor availability not found" });
      }

      const dayOfWeek = requestedDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const daySchedule = availability.weeklySchedule[dayOfWeek];

      if (!daySchedule.isAvailable) {
        return res.json({ success: true, slots: [] });
      }

      // Check for specific date overrides
      const specificDate = availability.specificDates.find(
        (sd) => sd.date.toDateString() === requestedDate.toDateString()
      );

      if (specificDate && !specificDate.isAvailable) {
        return res.json({ success: true, slots: [] });
      }

      // Generate time slots
      const slots = availability.generateSlotsForDay(requestedDate);

      // Filter out past time slots if it's today
      const now = new Date();
      const isToday = requestedDate.toDateString() === now.toDateString();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const futureSlots = isToday ? slots.filter(slot => {
        const [hours, minutes] = slot.startTime.split(':').map(Number);
        const slotTime = hours * 60 + minutes;
        return slotTime > currentTime;
      }) : slots;

      // Get existing appointments for this date
      const Appointment = require("../models/appointment");
      const existingAppointments = await Appointment.find({
        doctorId,
        appointmentDate: {
          $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
        },
        status: { $in: ["confirmed", "pending"] },
      });

      // Filter out booked slots
      const availableSlots = futureSlots.filter((slot) => {
        return !existingAppointments.some(
          (apt) => apt.startTime === slot.startTime
        );
      });

      res.json({
        success: true,
        slots: availableSlots,
        fee: availability.consultationFee,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = DoctorAvailabilityController;
