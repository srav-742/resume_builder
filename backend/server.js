// backend/server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const profileRoutes = require('./routes/profile');
const authenticate = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://resume-builder-ydr2.vercel.app',
    'https://resume-builder-lyart-six.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
// 1. User Routes (Login/Signup)
app.use('/api/user', userRoutes); // Note: Usually Auth routes don't need 'authenticate' middleware on the router itself, but inside the routes if needed.

// 2. Resume Routes (My Resumes, Save, Update)
app.use('/api/resume', authenticate, resumeRoutes);

// 3. Profile Routes (User Profile Info)
app.use('/api/profile', authenticate, profileRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: "Resume Builder Backend is running!", 
    success: true, 
    timestamp: new Date().toISOString() 
  });
});

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Global error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});