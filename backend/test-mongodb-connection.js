// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('=== MongoDB Connection Test ===\n');

// Check if MONGODB_URI is loaded
console.log('1. Checking environment variable:');
if (process.env.MONGODB_URI) {
    console.log('   ✅ MONGODB_URI is set');
    // Show first 30 characters for security
    console.log('   Preview:', process.env.MONGODB_URI.substring(0, 30) + '...');
} else {
    console.log('   ❌ MONGODB_URI is NOT set in .env file');
    console.log('   Make sure your .env file exists and contains MONGODB_URI');
    process.exit(1);
}

console.log('\n2. Testing connection...');

const testConnection = async () => {
    try {
        // Use the URI you provided
        const uri = process.env.MONGODB_URI;

        console.log('   Attempting to connect...');

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });

        console.log('   ✅ MongoDB connected successfully!');
        console.log('   Database:', mongoose.connection.db.databaseName);
        console.log('   Host:', mongoose.connection.host);

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n3. Available collections:');
        if (collections.length > 0) {
            collections.forEach(col => console.log('   -', col.name));
        } else {
            console.log('   No collections found (database is empty)');
        }

        await mongoose.connection.close();
        console.log('\n✅ Connection test passed!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);

        if (error.message.includes('bad auth')) {
            console.error('\n🔍 Authentication failed - Check:');
            console.error('   1. Username is correct: healthhubAdmin');
            console.error('   2. Password is correct (URL encoded): Shankar%407624');
            console.error('   3. Database user has access to "resumepath" database');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('\n🔍 Cannot find host - Check:');
            console.error('   1. Cluster URL is correct: cluster0.puo3paf.mongodb.net');
            console.error('   2. Your IP is whitelisted in MongoDB Atlas Network Access');
        } else if (error.message.includes('connect')) {
            console.error('\n🔍 Connection timeout - Check:');
            console.error('   1. Your internet connection');
            console.error('   2. MongoDB Atlas is accessible from your network');
            console.error('   3. IP whitelist includes your current IP or 0.0.0.0/0');
        }

        console.error('\nFull error:', error);
        process.exit(1);
    }
};

testConnection();
