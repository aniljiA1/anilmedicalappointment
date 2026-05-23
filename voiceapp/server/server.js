require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const { initSocket } = require('./socket/socketManager');

const appointmentRoutes = require('./routes/appointments');
const callRoutes = require('./routes/calls');
const recordingRoutes = require('./routes/recordings');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

initSocket(io);
app.set('io', io);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/recordings', recordingRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({ 
  status: 'ok', 
  timestamp: new Date(),
  bland: !!process.env.BLAND_API_KEY,
}));

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
