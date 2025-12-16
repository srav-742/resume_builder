// backend/lib/firebaseAdmin.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    // ✅ Clean private key: remove quotes + normalize newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/"/g, '');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message);
    process.exit(1);
  }
}

// ✅ Re-export for clarity (no change in behavior)
module.exports = admin;