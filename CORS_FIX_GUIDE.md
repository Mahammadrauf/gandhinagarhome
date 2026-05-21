# CORS & API Configuration Guide

## Problem
The frontend is experiencing CORS errors when calling `http://gandhinagarhomes.com/api/auth/check-user` (or any API endpoint from a different domain).

## Root Causes

### 1. **CORS Not Configured on Backend**
The backend API is not returning the required CORS headers to allow requests from the frontend domain.

### 2. **HTTP vs HTTPS Mismatch**
You mentioned the API uses HTTP while the frontend might be trying HTTPS, which is blocked by browsers.

## Solutions

### Frontend Side (✅ Already Applied)

1. **Created `.env.local`** with explicit API URL:
   ```
   NEXT_PUBLIC_API_URL=https://gandhinagarhomes.com/api
   ```

2. **Added `credentials: 'include'`** to fetch requests in `components/Header.tsx`
   - This allows cookies to be sent with cross-origin requests
   - Backend must respond with `Access-Control-Allow-Credentials: true`

### Backend Side (You Need to Do This)

The backend server MUST add CORS headers to allow requests. Add this middleware to your Node.js/Express backend:

#### For Express.js (Recommended):

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',          // Local development
    'https://gandhinagarhomes.com',   // Production frontend
    'https://www.gandhinagarhomes.com' // With www
  ],
  credentials: true,                  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware BEFORE route handlers
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
```

#### For Nginx Reverse Proxy:

```nginx
location /api/ {
  add_header 'Access-Control-Allow-Origin' 'https://gandhinagarhomes.com' always;
  add_header 'Access-Control-Allow-Credentials' 'true' always;
  add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
  
  if ($request_method = 'OPTIONS') {
    return 204;
  }
  
  proxy_pass http://localhost:5000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## HTTP vs HTTPS Issue

### If Backend is HTTP:
1. **Local development**: Keep as HTTP (`http://localhost:5000`)
2. **Production**: Must use HTTPS (browsers block mixed content)
   - Get SSL certificate (Let's Encrypt is free)
   - Configure server to listen on port 443 with HTTPS
   - Update `NEXT_PUBLIC_API_URL` to use HTTPS

### Current Frontend Config:
- `NEXT_PUBLIC_API_URL=https://gandhinagarhomes.com/api` ✅ (HTTPS)
- Make sure backend matches this protocol

## Testing

After applying backend CORS changes:

1. **Clear frontend cache:**
   ```bash
   npm run dev
   # Or restart your dev server
   ```

2. **Test in browser DevTools:**
   - Open DevTools → Network tab
   - Try to login
   - Check the `check-user` request
   - Look for response headers:
     ```
     Access-Control-Allow-Origin: https://gandhinagarhomes.com
     Access-Control-Allow-Credentials: true
     ```

3. **If CORS error still appears:**
   - Check browser console error details
   - Verify backend middleware is applied BEFORE routes
   - Check that `credentials: 'include'` is in frontend fetch options ✅ (done)

## Summary of Changes Made

✅ **Frontend (`components/Header.tsx`)**
- Added `credentials: 'include'` to `check-user` fetch
- Added `credentials: 'include'` to `send-otp` fetch

✅ **Frontend (`.env.local`)**
- Set explicit API URL to use HTTPS

⚠️ **Backend (NOT DONE - YOU NEED TO DO THIS)**
- Add CORS middleware to allow cross-origin requests
- Ensure backend uses HTTPS in production
- Respond with proper CORS headers

## Questions?

If CORS issues persist after applying backend changes:
1. Share backend error logs
2. Share the specific CORS error message from browser console
3. Confirm backend is running on HTTPS (if production)
