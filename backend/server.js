// Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/api");
const userRoutes = require('./routes/user');
const resumeRoutes = require('./routes/resume');
const path = require("path");

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORRECTED CORS CONFIGURATION
const corsOptions = {
  origin: [
    'http://localhost:3000',                          // Local dev
    'https://resume-builder-ydr2.vercel.app',         // ✅ Current Vercel frontend
    'https://resume-builder-lyart-six.vercel.app'     // Previous deployment (optional)
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
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
app.use('/api/user', userRoutes);
app.use('/api', resumeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Resume Builder Backend is running!',
    success: true,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production (if you ever bundle frontend here)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// 404 for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});