const Doctor = require("../models/doctor");
const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
class DoctorController {
  static isProfileComplete(doctor) {
    return (
      doctor.firstName &&
      doctor.lastName &&
      doctor.email &&
      doctor.phoneNumber &&
      doctor.dateOfBirth &&
      doctor.gender &&
      doctor.address &&
      doctor.address.street &&
      doctor.address.city &&
      doctor.address.state &&
      doctor.address.zipCode &&
      doctor.medicalLicenseNumber &&
      Array.isArray(doctor.specializations) &&
      doctor.specializations.length > 0 &&
      doctor.yearsOfExperience !== undefined &&
      doctor.yearsOfExperience !== null &&
      Array.isArray(doctor.education) &&
      doctor.education.length > 0
    );
  }

  // Create or update doctor profile
  static async createOrUpdateProfile(req, res) {
    try {
      const { firebaseUid } = req.params;
      const profileData = { ...req.body };

      // Prevent accidental overwrite of _id or firebaseUid
      delete profileData._id;
      delete profileData.firebaseUid;

      let doctor = await Doctor.findOne({ firebaseUid });

      if (doctor) {
        Object.assign(doctor, profileData);

        if (profileData.education) doctor.education = profileData.education;
        if (profileData.specializations)
          doctor.specializations = profileData.specializations;

        doctor.profileCompleted = DoctorController.isProfileComplete(doctor);

        await doctor.save();
      } else {
        doctor = new Doctor({
          firebaseUid,
          ...profileData,
        });
        doctor.profileCompleted = DoctorController.isProfileComplete(doctor);
        await doctor.save();
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor profile by ID
  static async getProfile(req, res) {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor by Firebase UID
  static async getProfileByFirebaseUid(req, res) {
    try {
      const { firebaseUid } = req.params;

      const doctor = await Doctor.findOne({ firebaseUid });

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      res.json({ success: true, doctor });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Search doctors (only show profileCompleted: true)
  static async searchDoctors(req, res) {
    try {
      const {
        specialty,
        city,
        state,
        minRating,
        maxFee,
        search,
        page = 1,
        limit = 12,
      } = req.query;

      let query = {
        profileCompleted: true,
      };

      if (specialty) {
        query.specializations = { $in: [specialty] };
      }
      if (city) {
        query["address.city"] = new RegExp(city, "i");
      }
      if (state) {
        query["address.state"] = new RegExp(state, "i");
      }
      if (minRating) {
        query.averageRating = { $gte: parseFloat(minRating) };
      }
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { specializations: { $in: [new RegExp(search, "i")] } },
          { "address.city": { $regex: search, $options: "i" } },
        ];
      }

      let doctors = await Doctor.find(query)
        .select(
          "firstName lastName specializations averageRating totalReviews profilePicture address bio yearsOfExperience"
        )
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ averageRating: -1 });

      // Get consultation fees for each doctor
      const DoctorAvailability = require("../models/doctorAvailability");
      const doctorsWithFees = await Promise.all(
        doctors.map(async (doctor) => {
          const availability = await DoctorAvailability.findOne({
            doctorId: doctor._id,
          });
          return {
            ...doctor.toObject(),
            consultationFee: availability?.consultationFee || 500,
          };
        })
      );

      // Filter by max fee if provided
      let filteredDoctors = doctorsWithFees;
      if (maxFee) {
        filteredDoctors = doctorsWithFees.filter(
          (doctor) => doctor.consultationFee <= parseFloat(maxFee)
        );
      }

      const total = await Doctor.countDocuments(query);

      res.json({
        success: true,
        doctors: filteredDoctors,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get doctor's detailed profile for booking
  static async getDoctorDetails(req, res) {
    try {
      const { doctorId } = req.params;

      const doctor = await Doctor.findById(doctorId).select(
        "-verificationDocuments -__v"
      );

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      // Get availability and fees
      const DoctorAvailability = require("../models/doctorAvailability");
      const availability = await DoctorAvailability.findOne({ doctorId });

      const doctorWithDetails = {
        ...doctor.toObject(),
        consultationFee: availability?.consultationFee || 500,
        weeklySchedule: availability?.weeklySchedule || null,
      };

      res.json({ success: true, doctor: doctorWithDetails });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get specializations list
  static async getSpecializations(req, res) {
    try {
      const specializations = await Doctor.distinct("specializations", {
        profileCompleted: true,
      });

      res.json({ success: true, specializations: specializations.sort() });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get cities where doctors are available
  static async getAvailableCities(req, res) {
    try {
      const cities = await Doctor.distinct("address.city", {
        profileCompleted: true,
      });

      res.json({ success: true, cities: cities.sort() });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getDoctorAnalytics(req, res) {
    try {
      console.log('🔍 Doctor Analytics Request - User from token:', req.user);
      
      const { timeRange = '30d' } = req.query;
      
      // Get doctor ID from token
      let doctorId = req.user?.userId || req.user?.id;
      
      console.log('🔍 Doctor ID from token:', doctorId);
      
      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: 'Doctor ID not found in token'
        });
      }

      // Calculate date range
      const now = new Date();
      let daysBack = 30;
      
      switch (timeRange) {
        case '7d': daysBack = 7; break;
        case '30d': daysBack = 30; break;
        case '90d': daysBack = 90; break;
        case '1y': daysBack = 365; break;
      }
      
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      // Convert to ObjectId
      const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

      // Get real appointments
      let myAppointments = [];
      try {
        myAppointments = await Appointment.find({
          doctorId: doctorObjectId,
          appointmentDate: { $gte: startDate, $lte: now }
        }).populate('patientId', 'firstName lastName profilePicture phoneNumber dateOfBirth gender bloodGroup');
        
        console.log('🔍 Found appointments:', myAppointments.length);
      } catch (error) {
        console.log('⚠️ Appointment query error:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Error fetching appointment data',
          error: error.message
        });
      }

      // Calculate real stats
      const totalAppointments = myAppointments.length;
      const completedAppointments = myAppointments.filter(apt => apt.status === 'completed').length;
      const upcomingAppointments = myAppointments.filter(apt => apt.status === 'confirmed').length;
      const cancelledAppointments = myAppointments.filter(apt => apt.status === 'cancelled').length;
      const pendingAppointments = myAppointments.filter(apt => apt.status === 'pending').length;

      // Revenue calculation
      const totalRevenue = myAppointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + (apt.consultationFee || 500), 0);

      // Appointments by status
      const appointmentsByStatus = [];
      if (completedAppointments > 0) appointmentsByStatus.push({ status: 'Completed', count: completedAppointments });
      if (upcomingAppointments > 0) appointmentsByStatus.push({ status: 'Upcoming', count: upcomingAppointments });
      if (pendingAppointments > 0) appointmentsByStatus.push({ status: 'Pending', count: pendingAppointments });
      if (cancelledAppointments > 0) appointmentsByStatus.push({ status: 'Cancelled', count: cancelledAppointments });

      // Appointments trend (last 30 days)
      const appointmentsTrend = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const appointmentsOnDate = myAppointments.filter(apt => {
          const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
          return aptDate === dateStr;
        }).length;
        
        appointmentsTrend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          appointments: appointmentsOnDate
        });
      }

      // Revenue trend
      const revenueTrend = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const revenueOnDate = myAppointments
          .filter(apt => {
            const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
            return aptDate === dateStr && apt.status === 'completed';
          })
          .reduce((sum, apt) => sum + (apt.consultationFee || 500), 0);
        
        revenueTrend.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: revenueOnDate
        });
      }

      // Patient demographics
      const patientsByGender = myAppointments
        .filter(apt => apt.patientId?.gender)
        .reduce((acc, apt) => {
          const gender = apt.patientId.gender;
          const existing = acc.find(g => g.gender === gender);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ gender, count: 1 });
          }
          return acc;
        }, []);

      // Patient age groups
      const patientsByAge = myAppointments
        .filter(apt => apt.patientId?.dateOfBirth)
        .reduce((acc, apt) => {
          const birthDate = new Date(apt.patientId.dateOfBirth);
          const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
          
          let ageGroup;
          if (age < 18) ageGroup = 'Under 18';
          else if (age < 30) ageGroup = '18-29';
          else if (age < 50) ageGroup = '30-49';
          else if (age < 70) ageGroup = '50-69';
          else ageGroup = '70+';

          const existing = acc.find(g => g.ageGroup === ageGroup);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ ageGroup, count: 1 });
          }
          return acc;
        }, []);

      // Recent activities
      const recentActivities = myAppointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(apt => ({
          action: `Appointment ${apt.status}`,
          description: `${apt.reasonForVisit || 'Consultation'} with ${apt.patientId?.firstName || 'Patient'} ${apt.patientId?.lastName || ''}`,
          type: apt.status,
          timestamp: new Date(apt.appointmentDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));

      // Top reasons for visits
      const reasonsForVisit = myAppointments
        .filter(apt => apt.reasonForVisit)
        .reduce((acc, apt) => {
          const reason = apt.reasonForVisit;
          const existing = acc.find(r => r.reason === reason);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ reason, count: 1 });
          }
          return acc;
        }, [])
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get unique patients count
      const uniquePatients = [...new Set(myAppointments.map(apt => apt.patientId?._id?.toString()))].filter(Boolean).length;

      // Compile response
      const analyticsData = {
        // Key Metrics
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalRevenue,
        uniquePatients,
        
        // Charts Data
        appointmentsTrend,
        revenueTrend,
        appointmentsByStatus,
        patientsByGender,
        patientsByAge,
        reasonsForVisit,
        
        // Activities
        recentActivities,
        
        // Summary
        summary: {
          totalAppointments,
          completedAppointments,
          upcomingAppointments,
          uniquePatients,
          totalRevenue,
          averageRevenue: totalAppointments > 0 ? (totalRevenue / completedAppointments).toFixed(0) : 0,
          completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : '0'
        }
      };

      console.log('✅ Doctor analytics data compiled successfully');

      res.json({
        success: true,
        data: analyticsData,
        timeRange
      });

    } catch (error) {
      console.error('❌ Doctor Analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctor analytics',
        error: error.message
      });
    }
  }
}

module.exports = DoctorController;
