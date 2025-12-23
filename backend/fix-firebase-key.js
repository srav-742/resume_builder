// Script to diagnose and show the correct format for Firebase private key
require('dotenv').config();

console.log('\n🔍 Diagnosing Firebase Private Key...\n');

const rawKey = process.env.FIREBASE_PRIVATE_KEY;

if (!rawKey) {
    console.log('❌ FIREBASE_PRIVATE_KEY not found in .env file\n');
    process.exit(1);
}

console.log('📋 Raw Key (first 100 chars):');
console.log(rawKey.substring(0, 100) + '...\n');

console.log('📋 Key length:', rawKey.length);
console.log('📋 Contains \\n (literal):', rawKey.includes('\\n'));
console.log('📋 Contains actual newlines:', rawKey.includes('\n'));
console.log('📋 Starts with quotes:', rawKey.startsWith('"'));
console.log('📋 Contains BEGIN PRIVATE KEY:', rawKey.includes('BEGIN PRIVATE KEY'));

console.log('\n🔧 Attempting to parse...\n');

try {
    // Try the current parsing logic
    const cleanedKey = rawKey
        .replace(/\\n/g, '\n')  // Convert literal \n to actual newlines
        .replace(/"/g, '');      // Remove quotes

    console.log('✅ After cleaning (first 100 chars):');
    console.log(cleanedKey.substring(0, 100) + '...\n');

    // Check if it looks like a valid PEM key
    if (cleanedKey.includes('-----BEGIN PRIVATE KEY-----') &&
        cleanedKey.includes('-----END PRIVATE KEY-----')) {
        console.log('✅ Key appears to be in valid PEM format');

        // Try to use it with Firebase Admin
        const admin = require('firebase-admin');
        const testCredentials = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: cleanedKey,
        };

        console.log('\n🧪 Testing Firebase Admin initialization...\n');

        const testApp = admin.initializeApp({
            credential: admin.credential.cert(testCredentials),
        }, 'test-app');

        console.log('✅ SUCCESS! Firebase Admin can be initialized with this key\n');
        testApp.delete();

    } else {
        console.log('❌ Key does NOT appear to be in valid PEM format');
        console.log('\n📝 The key in your .env should look like this:');
        console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBA...\\n-----END PRIVATE KEY-----\\n"');
        console.log('\nNote: Use literal \\n (backslash-n), not actual line breaks\n');
    }

} catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n📝 Your .env file should have the private key in this format:');
    console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYourKeyHere\\n-----END PRIVATE KEY-----\\n"');
    console.log('\nMake sure to:');
    console.log('1. Wrap the entire key in double quotes');
    console.log('2. Use \\n (backslash-n) for newlines, not actual line breaks');
    console.log('3. Include the BEGIN and END markers');
    console.log('4. Copy the key exactly as it appears in your Firebase service account JSON\n');
}
