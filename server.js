const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const routes = require("./routes/api")
const authRoutes = require("./routes/auth") // ← Added this line
const path = require("path")

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// API Routes
app.use("/api", routes)
app.use("/api/auth", authRoutes) // ← Added this line

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Server error", message: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})