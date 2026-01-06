// backend/server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const userRoutes = require("./routes/user");
const resumeRoutes = require("./routes/resume");
const profileRoutes = require("./routes/profile");
const aiRoutes = require("./routes/ai");
const aiCounsellorRoutes = require("./routes/aiCounsellor");
const counsellingRoutes = require("./routes/counselling");
const conversationsRoutes = require("./routes/conversations");
const jobsRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const authenticate = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:5173',
    'https://resume-builder-ydr2.vercel.app',
    'https://resume-builder-lyart-six.vercel.app',
    'https://resume-builder-8bque.vercel.app',
    'https://resume-builder-delta-seven.vercel.app' // ✅ ADDED: New Vercel Domain
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Handle preflight requests
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// ✅ Added security headers for OAuth popups and COOP
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ MongoDB Connection with Retry Logic
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ✅ Protected routes with authentication middleware
app.use('/api/users', authenticate, userRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/resume', authenticate, resumeRoutes);
app.use('/api/ai', authenticate, aiRoutes);
app.use('/api/ai-counsellor', authenticate, aiCounsellorRoutes);
app.use('/api/counselling', authenticate, counsellingRoutes);
app.use('/api/conversations', authenticate, conversationsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', authenticate, applicationRoutes);

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

// ✅ Process-level error handlers to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit the process - keep server running
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit the process - keep server running
});

// Keep process alive on MongoDB errors
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});
