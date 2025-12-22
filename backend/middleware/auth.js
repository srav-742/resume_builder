// backend/middleware/auth.js
const admin = require('../lib/firebaseAdmin');

const authenticate = async (req, res, next) => {
  console.log('🔐 Auth middleware called for:', req.method, req.path);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing or invalid authorization header');
    return res.status(401).json({ error: 'Missing token' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('✅ Token extracted, length:', idToken.length);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Token verified for user:', decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || null
    };
    next();
  } catch (error) {
    console.error('========== AUTH ERROR ==========');
    console.error('❌ Token verification failed');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Token (first 20 chars):', idToken.substring(0, 20) + '...');
    console.error('================================');
    return res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

module.exports = authenticate;