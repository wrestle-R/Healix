const Patient = require("../models/patient");
const Appointment = require("../models/appointment"); // ADD THIS
const mongoose = require("mongoose"); // ADD THIS

class PatientController {
  static async createOrUpdateProfile(req, res) {
    try {
      const { firebaseUid } = req.params;
      const profileData = { ...req.body };

      delete profileData._id;
      delete profileData.firebaseUid;

      let patient = await Patient.findOne({ firebaseUid });

      if (patient) {
        for (const key in profileData) {
          patient[key] = profileData[key];
        }
        patient.checkProfileCompletion();
        await patient.save();
      } else {
        patient = new Patient({
          firebaseUid,
          ...profileData,
        });
        patient.checkProfileCompletion();
        await patient.save();
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patient profile by Mongo _id
  static async getProfile(req, res) {
    try {
      const { patientId } = req.params;

      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patient by Firebase UID
  static async getProfileByFirebaseUid(req, res) {
    try {
      const { firebaseUid } = req.params;

      const patient = await Patient.findOne({ firebaseUid });

      if (!patient) {
        return res
          .status(404)
          .json({ success: false, message: "Patient not found" });
      }

      res.json({ success: true, patient });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get patients for a specific doctor
  static async getDoctorPatients(req, res) {
    try {
      const { doctorId } = req.params;
      // Assuming each patient has a field like assignedDoctor or doctorId
      const patients = await Patient.find({ doctorId });
      res.json({ success: true, patients });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

static async getPatientAnalytics(req, res) {
  try {
    console.log('🔍 Analytics Request - User from token:', req.user);
    
    const { timeRange = '30d' } = req.query;
    
    // Get patient ID from token
    let patientId = req.user?.userId || req.user?.id;
    
    console.log('🔍 Patient ID from token:', patientId);
    
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID not found in token'
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
    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    // Get real appointments only
    let myAppointments = [];
    try {
      myAppointments = await Appointment.find({
        patientId: patientObjectId,
        appointmentDate: { $gte: startDate, $lte: now }
      }).populate('doctorId', 'firstName lastName specializations');
      
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

    // Appointments by status (real data only)
    const appointmentsByStatus = [];
    if (completedAppointments > 0) appointmentsByStatus.push({ status: 'Completed', count: completedAppointments });
    if (upcomingAppointments > 0) appointmentsByStatus.push({ status: 'Upcoming', count: upcomingAppointments });
    if (cancelledAppointments > 0) appointmentsByStatus.push({ status: 'Cancelled', count: cancelledAppointments });

    // Appointments trend (real data only)
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

    // Doctors visited (real data only)
    const doctorsVisited = myAppointments
      .filter(apt => apt.doctorId)
      .reduce((acc, apt) => {
        const doctorName = `Dr. ${apt.doctorId.firstName} ${apt.doctorId.lastName}`;
        const specialty = apt.doctorId.specializations?.[0] || 'General';
        
        const existing = acc.find(d => d.name === doctorName);
        if (existing) {
          existing.visits += 1;
        } else {
          acc.push({ name: doctorName, specialty, visits: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);

    // Average ratings of visited doctors (real data only)
    const averageRatings = myAppointments
      .filter(apt => apt.doctorId && apt.doctorId.averageRating)
      .reduce((acc, apt) => {
        const doctorName = `Dr. ${apt.doctorId.firstName} ${apt.doctorId.lastName}`;
        const rating = apt.doctorId.averageRating || 0;
        
        const existing = acc.find(d => d.doctor === doctorName);
        if (!existing) {
          acc.push({ doctor: doctorName, rating: parseFloat(rating.toFixed(1)) });
        }
        return acc;
      }, [])
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // Recent activities (real data only)
    const recentActivities = myAppointments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(apt => ({
        action: `Appointment ${apt.status}`,
        description: `${apt.reasonForVisit || 'Consultation'} with Dr. ${apt.doctorId?.firstName || 'Doctor'}`,
        type: apt.status,
        timestamp: new Date(apt.appointmentDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

    // Compile real data only
    const analyticsData = {
      // Key Metrics
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      cancelledAppointments,
      
      // Charts Data
      appointmentsTrend,
      appointmentsByStatus,
      doctorsVisited,
      averageRatings,
      
      // Activities
      recentActivities,
      
      // Summary
      summary: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        completionRate: totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : '0'
      }
    };

    console.log('✅ Real analytics data compiled');

    res.json({
      success: true,
      data: analyticsData,
      timeRange
    });

  } catch (error) {
    console.error('❌ Patient Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient analytics',
      error: error.message
    });
  }
}
}

module.exports = PatientController;
