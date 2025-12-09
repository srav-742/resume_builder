// backend/server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes (✅ REMOVED profileRoutes)
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const authenticate = require("./middleware/auth");
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: Allow your frontend origins
// ⚠️ Also FIX: remove trailing spaces in origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://resume-builder-ydr2.vercel.app',
    'https://resume-builder-lyart-six.vercel.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Route order: SPECIFIC before GENERAL
// ❌ REMOVED: app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/user', authenticate, userRoutes);
app.use('/api/resume', authenticate, resumeRoutes);
app.use('/api/profile', profileRoutes); 

// Optional: catch-all /api route (only if needed, and place LAST)
// app.use('/api', authenticate, require('./routes/api'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: "Resume Builder Backend is running!", 
    success: true, 
    timestamp: new Date().toISOString() 
  });
});

// 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Global error:", err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});