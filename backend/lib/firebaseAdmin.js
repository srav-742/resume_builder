
// backend/lib/firebaseAdmin.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    // ✅ Clean private key: handle both literal \n and actual newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // If the key contains literal \n (as a string), convert them to actual newlines
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Remove any extra quotes that might be embedded
    privateKey = privateKey.replace(/"/g, '');

    const credentials = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    };

    // Debug logging
    console.log('🔐 Firebase Admin Credentials:');
    console.log(`   Project ID: ${credentials.projectId}`);
    console.log(`   Client Email: ${credentials.clientEmail}`);
    console.log(`   Private Key: ${privateKey ? '✅ Present' : '❌ Missing'}`);

    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message);
    process.exit(1);
  }
}

module.exports = admin;