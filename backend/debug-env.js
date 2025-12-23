const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = dotenv.parse(envContent);

console.log('--- Diagnosis ---');
console.log('PORT:', config.PORT);
console.log('MONGODB_URI:', config.MONGODB_URI ? 'EXISTS' : 'MISSING');
console.log('GEMINI_API_KEY Length:', config.GEMINI_API_KEY ? config.GEMINI_API_KEY.length : 0);
if (config.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY Start:', config.GEMINI_API_KEY.substring(0, 10));
}
console.log('FIREBASE_PROJECT_ID:', config.FIREBASE_PROJECT_ID);
console.log('--- End of Diagnosis ---');
