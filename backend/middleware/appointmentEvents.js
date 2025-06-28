// middlewares/appointmentEvents.js
const Appointment = require('../models/appointment');
const googleCalendarService = require('../services/googleCalendarService');

async function handleAppointmentCreated(appointmentId) {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId patientId');
    
    console.log('Attempting calendar event for:', {
      appointmentId,
      doctor: appointment.doctorId.email,
      patient: appointment.patientId.email
    });

    await googleCalendarService.createCalendarEvent(appointmentId);
  } catch (error) {
    console.error('Calendar event creation failed:', {
      error: error.message,
      stack: error.stack
    });
    // Don't throw - appointment should still complete
  }
}
async function handleAppointmentUpdated(appointmentId) {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (appointment.status === 'cancelled') {
      await googleCalendarService.deleteCalendarEvent(appointmentId);
    } else {
      await googleCalendarService.updateCalendarEvent(appointmentId);
    }
  } catch (error) {
    console.error('Error handling appointment update:', error);
  }
}

async function handleAppointmentDeleted(appointmentId) {
  try {
    await googleCalendarService.deleteCalendarEvent(appointmentId);
  } catch (error) {
    console.error('Error handling appointment deletion:', error);
  }
}

module.exports = {
  handleAppointmentCreated,
  handleAppointmentUpdated,
  handleAppointmentDeleted,
};