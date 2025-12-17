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
const authenticate = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: Cleaned origins (no trailing spaces)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173', // Vite default
    'https://resume-builder-ydr2.vercel.app',
    'https://resume-builder-lyart-six.vercel.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
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
    // Retry connection after 5 seconds
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ✅ Apply authentication to all resume routes (since they require user context)
app.use('/api/user', authenticate, userRoutes);
app.use('/api/profile', authenticate, profileRoutes);
app.use('/api/resume', authenticate, resumeRoutes);
app.use('/api/ai', authenticate, aiRoutes);

// Optional: If you have public API routes (e.g., /api/analyze), mount them WITHOUT auth and BEFORE authenticated ones
// But currently, all resume operations are user-bound → so this is not needed

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


