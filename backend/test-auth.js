// test-auth.js - Test Firebase Admin and MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const admin = require('./lib/firebaseAdmin');

async function testConnections() {
    console.log('\n🔍 Testing Backend Configuration...\n');

    // Test 1: Environment Variables
    console.log('1️⃣ Checking Environment Variables:');
    console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
    console.log(`   FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing'}`);
    console.log(`   FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}\n`);

    // Test 2: MongoDB Connection
    console.log('2️⃣ Testing MongoDB Connection:');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('   ✅ MongoDB connected successfully');
        console.log(`   Database: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}\n`);
    } catch (error) {
        console.error('   ❌ MongoDB connection failed:', error.message, '\n');
    }

    // Test 3: Firebase Admin
    console.log('3️⃣ Testing Firebase Admin SDK:');
    try {
        const app = admin.app();
        console.log('   ✅ Firebase Admin initialized');
        console.log(`   Project ID: ${app.options.projectId}\n`);
    } catch (error) {
        console.error('   ❌ Firebase Admin failed:', error.message, '\n');
    }

    // Test 4: User Model
    console.log('4️⃣ Testing User Model:');
    try {
        const User = require('./models/User');
        const userCount = await User.countDocuments();
        console.log(`   ✅ User model loaded`);
        console.log(`   Total users in database: ${userCount}\n`);
    } catch (error) {
        console.error('   ❌ User model failed:', error.message, '\n');
    }

    await mongoose.connection.close();
    console.log('✅ Tests completed!\n');
    process.exit(0);
}

testConnections();
