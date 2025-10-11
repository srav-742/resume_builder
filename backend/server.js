// Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/api");
// const authRoutes = require("./routes/auth") // ← REMOVED: obsolete per Step 4
const userRoutes = require('./routes/user'); // ← Kept: Firebase UID sync route
const resumeRoutes = require('./routes/resume'); // ✅ NEW: Resume data persistence route
const path = require("path");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Updated CORS configuration for production
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://resume-builder-lyart-six.vercel.app' // ← FIXED: removed trailing spaces
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' })); // Prevent payload too large
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// API Routes
app.use("/api", routes);
// app.use("/api/auth", authRoutes); // ← REMOVED: no longer used
app.use('/api/user', userRoutes); // ← Firebase user sync route
app.use('/api', resumeRoutes); // ✅ NEW: Resume fetch/save route (e.g., GET/POST /api/user/resumes)

// Health check route (optional but helpful for debugging)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ FIX: Add root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Resume Builder Backend is running!',
    success: true,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Centralized error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Internal server error" });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});