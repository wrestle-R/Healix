// services/googleCalendarService.js
const { google } = require('googleapis');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');

class GoogleCalendarService {
  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
  }

  async setCredentials(user) {
  // Debugging logs
  console.log('Checking credentials for user:', {
    userId: user._id,
    hasAccessToken: !!user.googleAccessToken,
    hasRefreshToken: !!user.googleRefreshToken
  });

  if (!user?.googleAccessToken || !user?.googleRefreshToken) {
    throw new Error(`Google credentials missing for ${user.email}. 
      Access Token: ${!!user.googleAccessToken}
      Refresh Token: ${!!user.googleRefreshToken}`);
  }

  this.oAuth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry
  });

  // Verify credentials are valid
  try {
    await this.oAuth2Client.getAccessToken();
  } catch (err) {
    console.error('Token verification failed:', err);
    throw new Error('Invalid Google credentials');
  }
}
  async createCalendarEvent(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('doctorId', 'googleAccessToken googleRefreshToken firstName lastName email')
        .populate('patientId', 'googleAccessToken googleRefreshToken firstName lastName email');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Create event for doctor
      await this._createEventForUser(appointment, appointment.doctorId);
      
      // Create event for patient
      await this._createEventForUser(appointment, appointment.patientId);
      
      return true;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      return false;
    }
  }

  async _createEventForUser(appointment, user) {
    try {
      await this.setCredentials(user);
      
      const event = {
        summary: `Doctor Appointment with ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
        description: `Reason: ${appointment.reasonForVisit}\nSymptoms: ${appointment.symptoms.join(', ')}`,
        start: {
          dateTime: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.startTime}:00`),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.endTime}:00`),
          timeZone: 'Asia/Kolkata',
        },
        attendees: [
          { email: appointment.doctorId.email },
          { email: appointment.patientId.email },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all',
      });

      // Save the Google Calendar event ID to the appointment
      if (user._id.equals(appointment.doctorId._id)) {
        appointment.doctorCalendarEventId = response.data.id;
      } else {
        appointment.patientCalendarEventId = response.data.id;
      }
      
      await appointment.save();
      
      return response.data;
    } catch (error) {
      console.error(`Error creating Google Calendar event for user ${user.email}:`, error);
      throw error;
    }
  }

  async updateCalendarEvent(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('doctorId', 'googleAccessToken googleRefreshToken')
        .populate('patientId', 'googleAccessToken googleRefreshToken');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Update event for doctor
      if (appointment.doctorCalendarEventId) {
        await this._updateEventForUser(appointment, appointment.doctorId);
      }
      
      // Update event for patient
      if (appointment.patientCalendarEventId) {
        await this._updateEventForUser(appointment, appointment.patientId);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      return false;
    }
  }

  async _updateEventForUser(appointment, user) {
    try {
      await this.setCredentials(user);
      
      const eventId = user._id.equals(appointment.doctorId._id) 
        ? appointment.doctorCalendarEventId 
        : appointment.patientCalendarEventId;

      const event = {
        summary: `Doctor Appointment with ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
        description: `Reason: ${appointment.reasonForVisit}\nSymptoms: ${appointment.symptoms.join(', ')}`,
        start: {
          dateTime: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.startTime}:00`),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: new Date(`${appointment.appointmentDate.toISOString().split('T')[0]}T${appointment.endTime}:00`),
          timeZone: 'Asia/Kolkata',
        },
        status: appointment.status === 'cancelled' ? 'cancelled' : 'confirmed',
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating Google Calendar event for user ${user.email}:`, error);
      throw error;
    }
  }

  async deleteCalendarEvent(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('doctorId', 'googleAccessToken googleRefreshToken')
        .populate('patientId', 'googleAccessToken googleRefreshToken');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Delete event for doctor
      if (appointment.doctorCalendarEventId) {
        await this._deleteEventForUser(appointment.doctorId, appointment.doctorCalendarEventId);
      }
      
      // Delete event for patient
      if (appointment.patientCalendarEventId) {
        await this._deleteEventForUser(appointment.patientId, appointment.patientCalendarEventId);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      return false;
    }
  }

  async _deleteEventForUser(user, eventId) {
    try {
      await this.setCredentials(user);
      
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting Google Calendar event for user ${user.email}:`, error);
      throw error;
    }
  }
}

module.exports = new GoogleCalendarService();