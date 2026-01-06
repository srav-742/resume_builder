# Firebase Configuration Guide

## Overview
Your resume builder application uses Firebase for authentication. The configuration has been updated to use environment variables for better security.

## What Was Updated

### Frontend (`frontend/lib/firebase.ts`)
- ✅ Replaced hardcoded Firebase config with environment variables
- ✅ Uses `NEXT_PUBLIC_*` prefix for client-side access

### Backend (`backend/lib/firebaseAdmin.js`)
- ✅ Already configured to use environment variables
- ✅ Uses Firebase Admin SDK for server-side operations

## Setup Instructions

### 1. Frontend Configuration

Create a file named `.env.local` in the `frontend` directory with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAnxMKG0_CcN7vzXjIpdjM1OeCz6GPCFHE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=resume-builder-7d288.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=resume-builder-7d288
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=resume-builder-7d288.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=762739174513
NEXT_PUBLIC_FIREBASE_APP_ID=1:762739174513:web:cd321a73a6b325b445bfd0
```

### 2. Backend Configuration

Ensure your `backend/.env` file contains:

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=resume-builder-7d288
FIREBASE_CLIENT_EMAIL=your-service-account@resume-builder-7d288.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` must be wrapped in double quotes
- The `\n` characters will be automatically converted to actual newlines by the code
- You can find these values in your Firebase Console → Project Settings → Service Accounts

## Getting Firebase Admin SDK Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `resume-builder-7d288`
3. Click on ⚙️ **Settings** → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will be downloaded containing:
   - `project_id` → Use for `FIREBASE_PROJECT_ID`
   - `client_email` → Use for `FIREBASE_CLIENT_EMAIL`
   - `private_key` → Use for `FIREBASE_PRIVATE_KEY`

## Restart Your Application

After updating the `.env` files, restart both servers:

### Frontend
```bash
cd frontend
# Stop the current dev server (Ctrl+C)
npm run dev
```

### Backend
```bash
cd backend
# Stop the current server (Ctrl+C)
node server.js
```

## Verification

Check the backend console logs. You should see:
```
🔐 Firebase Admin Credentials:
   Project ID: resume-builder-7d288
   Client Email: your-service-account@...
   Private Key: ✅ Present
✅ Firebase Admin initialized successfully
```

If you see errors, double-check:
- All environment variables are set correctly
- The private key is properly formatted with `\n` for newlines
- The private key is wrapped in double quotes in the `.env` file

## Security Notes

✅ `.env` and `.env.local` files are in `.gitignore` - your keys won't be committed
✅ Never share your `FIREBASE_PRIVATE_KEY` or other credentials
✅ Frontend config uses `NEXT_PUBLIC_*` prefix (these are safe for client-side)
✅ Backend uses Firebase Admin SDK (requires server-side private key)

## Troubleshooting

**Error: "Failed to parse private key"**
- Ensure the private key is wrapped in double quotes
- Check that `\n` characters are present (not actual newlines)

**Error: "Firebase Admin init failed"**
- Verify all three Firebase variables are set in backend `.env`
- Check that project ID and client email match your Firebase project

**Frontend: Firebase not working**
- Ensure `.env.local` exists in the `frontend` directory
- Restart the Next.js dev server
- Check browser console for errors
