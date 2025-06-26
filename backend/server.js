const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config.js');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes.js');
const patientRoutes = require('./routes/patientRoutes.js');
const appointmentRoutes = require('./routes/appointmentRoutes.js');
const doctorAvailabilityRoutes = require('./routes/doctorAvailabilityRoutes.js');


const PORT = process.env.PORT || 5000;
dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', doctorAvailabilityRoutes);

app.get('/', (req, res) => {
  res.send(`API is running — and the database is connected!`);
});

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

