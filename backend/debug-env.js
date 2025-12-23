// Debug Environment Variables
const dotenv = require('dotenv');
const path = require('path');

console.log('=== Environment Debug ===\n');

// Load .env file
const result = dotenv.config();

if (result.error) {
    console.log('❌ Error loading .env file:', result.error.message);
} else {
    console.log('✅ .env file loaded successfully');
    console.log('   Location:', path.resolve('.env'));
}

console.log('\n📋 All Environment Variables from .env:\n');

// List all variables that should be in .env
const expectedVars = [
    'MONGODB_URI',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'GEMINI_API_KEY',
    'PORT'
];

expectedVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}:`);
        if (varName === 'MONGODB_URI') {
            console.log(`   ${value.substring(0, 50)}...`);
        } else if (varName.includes('KEY') || varName.includes('EMAIL')) {
            console.log(`   [SET - ${value.length} characters]`);
        } else {
            console.log(`   ${value}`);
        }
    } else {
        console.log(`❌ ${varName}: NOT SET`);
    }
});

// Check for typos or similar variable names
console.log('\n🔍 Checking for common typos:\n');
const allEnvVars = Object.keys(process.env).filter(key =>
    key.toLowerCase().includes('mongo') ||
    key.toLowerCase().includes('db') ||
    key.toLowerCase().includes('uri')
);

if (allEnvVars.length > 0) {
    console.log('Found these database-related variables:');
    allEnvVars.forEach(key => {
        console.log(`   - ${key}`);
    });
} else {
    console.log('No MongoDB-related environment variables found');
}

// Show the exact check that server.js does
console.log('\n🔬 Testing the exact server.js check:\n');
if (!process.env.MONGODB_URI) {
    console.log('❌ This would trigger the error: "MONGODB_URI is not defined in .env file"');
    console.log('   typeof process.env.MONGODB_URI:', typeof process.env.MONGODB_URI);
    console.log('   process.env.MONGODB_URI value:', process.env.MONGODB_URI);
} else {
    console.log('✅ MONGODB_URI check would pass in server.js');
}
