# 🔴 SOLUTION: 401 Unauthorized Error

## The Problem
You're getting:
```
401 Unauthorized - /api/counselling/generate-analysis
500 Internal Server Error
```

## Root Cause
**Your Firebase authentication token has expired or is invalid.**

## ✅ SOLUTION - Quick Fix

### Step 1: Log Out and Log Back In
1. **Go to http://localhost:3000**
2. **Click your profile/user icon** (top right)
3. **Click "Logout"** or "Sign Out"
4. **Close the browser tab**
5. **Open a new tab** and go to http://localhost:3000
6. **Log in again** with your credentials
7. This will generate a **fresh authentication token**

### Step 2: Try Career Counselling Again
1. After logging back in, go to **AI Counsellor**
2. Click **Career Counselling**
3. Complete the questionnaire
4. Click **"Generate Analysis"**

---

## Why This Happens

Firebase authentication tokens expire after **1 hour** by default. When you:
- Keep the page open for a long time
- Test multiple times
- Have the app running for extended periods

The token becomes stale and the backend rejects it with **401 Unauthorized**.

---

## 🔍 If That Doesn't Fix It

If logging out and back in doesn't work, please try this:

### Option A: Clear Browser Cache
1. Press **Ctrl+Shift+Delete**
2. Select "Cookies and other site data"
3. Clear cache
4. Restart browser
5. Log in again

### Option B: Check Backend Logs
After you try to generate analysis, check the backend terminal for:

```
========== AUTH ERROR ==========
❌ Token verification failed
Error message: ...
Error code: ...
================================
```

**Share this error message with me** and I'll fix it immediately.

---

## 📊 What the Backend Will Show

When you try to generate analysis now, the backend terminal will show:

### ✅ If Auth Works:
```
🔐 Auth middleware called for: POST /api/counselling/generate-analysis
✅ Token extracted, length: [number]
✅ Token verified for user: [your-user-id]
========== GENERATE ANALYSIS CALLED ==========
...
```

### ❌ If Auth Fails:
```
🔐 Auth middleware called for: POST /api/counselling/generate-analysis
========== AUTH ERROR ==========
❌ Token verification failed
Error message: Token expired
Error code: auth/id-token-expired
================================
```

---

## 🎯 Test Instructions

### 1. Log Out & Log Back In (IMPORTANT!)
### 2. Try Career Counselling
### 3. Watch Backend Terminal

After you click "Generate Analysis", check the backend terminal and **share the logs** here.

Look for:
- `🔐 Auth middleware called` - confirms the request is hitting the server
- `✅ Token verified` - authentication passed
- `========== GENERATE ANALYSIS CALLED ==========` - endpoint is executing
- Any error messages

---

## Additional Checks

### Is the Backend Running?
Check that you see:
```
✅ Firebase Admin initialized successfully
✅ Gemini AI initialized successfully  
✅ Gemini AI initialized for counselling
🚀 Backend running on http://localhost:5000
✅ MongoDB connected successfully
```

### Is the Frontend Running?
Check that you see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
✓ Ready in [X]s
```

---

## 🚀 Ready to Test

**Both servers are running now:**
- ✅ Backend: http://localhost:5000
- ✅ Frontend: http://localhost:3000

**Please:**
1. **Log out and log back in** (this is critical!)
2. **Try Career Counselling again**
3. **Share the backend terminal output** after clicking "Generate Analysis"

The enhanced logging will show us exactly what's happening! 🔍
