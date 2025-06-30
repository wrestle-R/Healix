const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config.js');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes.js');
const patientRoutes = require('./routes/patientRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const doctorAvailabilityRoutes = require('./routes/doctorAvailabilityRoutes.js');
const therapyRoutes = require('./routes/therapyRoutes.js');
const chatbotRoutes=require('./routes/chatbotRoutes');

const PORT = process.env.PORT || 5000;
dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ["https://healix-alpha.vercel.app", "http://localhost:5173", "https://healix-med.vercel.app"]
}));
app.use(express.json());

//routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', doctorAvailabilityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/therapies', therapyRoutes);
app.use('/api/medical',chatbotRoutes );



app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

