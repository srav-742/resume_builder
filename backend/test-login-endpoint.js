// test-login-endpoint.js - Test the actual login flow
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authenticate = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Apply the same routing as server.js
app.use('/api/user', authenticate, userRoutes);

// Test endpoint without auth
app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working!' });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`\n🧪 Test server running on http://localhost:${PORT}`);
    console.log(`\nTo test authentication:`);
    console.log(`1. Login at http://localhost:3000/login`);
    console.log(`2. Copy the Firebase ID token from browser console`);
    console.log(`3. Run: curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:${PORT}/api/user/profile\n`);
});
