# Email Authentication Setup Guide

This guide will walk you through setting up secure email-based authentication for the admin area.

## 🎯 What This Does

- **Whitelist Control**: Only authorized emails can request login codes
- **Real Email Delivery**: Sends actual 6-digit codes via email
- **Secure Authentication**: Codes expire after 10 minutes
- **One-Time Use**: Each code can only be used once
- **Auto Cleanup**: Expired codes are automatically deleted

## 📋 Prerequisites

1. Firebase project (already set up ✅)
2. Resend account (free tier: 100 emails/day, 3,000/month)
3. Firebase CLI installed
4. Node.js 18+ installed

## 🚀 Step-by-Step Setup

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Functions

From your project root:

```bash
firebase init functions
```

Select:
- **Language**: JavaScript
- **ESLint**: No (or Yes if you prefer)
- **Install dependencies**: Yes

This will create a `functions` folder with the necessary structure.

### Step 4: Copy the Cloud Functions Code

The functions code is already in `/functions/index.js`. Install dependencies:

```bash
cd functions
npm install
```

### Step 5: Set Up Resend

#### 5a. Create Resend Account

1. Go to https://resend.com/
2. Sign up for free (100 emails/day, 3,000/month)
3. Verify your email address

#### 5b. Get API Key

1. In your Resend dashboard, go to "API Keys"
2. Click "Create API Key"
3. Name it: "BSEGv2 Admin Auth"
4. Copy the API key: **re_J6dYXZtz_AiRepkzemKFva9mCuMYvsg6M** ✅ (Already done!)

#### 5c. Sender Email

For now, use Resend's default sender: `onboarding@resend.dev`

Later, if you want to use your own domain:
1. Go to Resend Dashboard > Domains
2. Add your domain (e.g., `bluestarequitygroup.com`)
3. Configure DNS records
4. Update `functions/index.js` line 51 to use your domain

#### 5d. Set API Key in Firebase

```bash
firebase functions:config:set resend.key="re_J6dYXZtz_AiRepkzemKFva9mCuMYvsg6M"
```

### Step 6: Configure Authorized Emails

Edit `functions/index.js` lines 8-11:

```javascript
const AUTHORIZED_EMAILS = [
  'howard@bluestarequitygroup.com',
  'another-admin@bluestarequitygroup.com', // Add more as needed
];
```

### Step 7: Set Up Firestore Security Rules

Add these rules to your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Login codes - only Cloud Functions can read/write
    match /loginCodes/{email} {
      allow read, write: if false; // Only Cloud Functions can access
    }

    // Public job listings
    match /artifacts/{appId}/public/data/jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

### Step 8: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

This will deploy:
- `sendLoginCode` - Sends email with code
- `verifyLoginCode` - Verifies code and returns auth token
- `cleanupExpiredCodes` - Runs hourly to clean up expired codes

### Step 9: Update Firebase Config in Frontend

Make sure your Firebase config includes the Functions region. In your `index.html` or environment:

```javascript
window.__firebase_config = JSON.stringify({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### Step 10: Test the System

1. Navigate to the Admin page
2. Enter an authorized email address
3. Click "Send Login Code"
4. Check your email for the 6-digit code
5. Enter the code and click "Verify & Log In"

## 🔐 Security Features

- **Email Whitelist**: Only pre-approved emails can request codes
- **Time-Limited Codes**: Codes expire after 10 minutes
- **One-Time Use**: Codes are deleted after successful verification
- **Rate Limiting**: Firebase automatically rate-limits function calls
- **Secure Storage**: Codes are hashed and stored in Firestore
- **Custom Tokens**: Uses Firebase custom tokens for authentication

## 🧪 Testing Locally

To test functions locally:

```bash
cd functions
npm run serve
```

This starts the Firebase emulators. Update your frontend to use:

```javascript
// In development
if (window.location.hostname === 'localhost') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## 📧 Email Template Customization

Edit the email HTML in `functions/index.js` lines 49-78 to customize:
- Logo/branding
- Colors
- Message content
- Footer information

## 🛠️ Troubleshooting

### "Functions not found" error
- Make sure functions are deployed: `firebase deploy --only functions`
- Check Firebase Console > Functions to see if they're active

### "Permission denied" error
- Verify the email is in the AUTHORIZED_EMAILS array
- Check spelling and case sensitivity

### Email not received
- Check spam/junk folder
- Verify SendGrid sender is verified
- Check SendGrid dashboard for delivery status
- Check Firebase Functions logs: `firebase functions:log`

### "Code expired" error
- Codes expire after 10 minutes
- Request a new code

### SendGrid API errors
- Verify API key is set: `firebase functions:config:get`
- Check SendGrid API key permissions
- Verify sender email is authenticated in SendGrid

## 💰 Cost Considerations

**Free Tier Limits:**
- **Resend**: 100 emails/day, 3,000/month (forever free)
- **Firebase Functions**: 2M invocations/month, 400K GB-seconds/month
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day

For the admin use case, you'll stay well within free tier limits.

## 🔄 Adding More Authorized Users

1. Edit `functions/index.js`
2. Add email to `AUTHORIZED_EMAILS` array
3. Redeploy functions: `firebase deploy --only functions`

Example:

```javascript
const AUTHORIZED_EMAILS = [
  'howard@bluestarequitygroup.com',
  'admin2@bluestarequitygroup.com',
  'hr@bluestarequitygroup.com',
];
```

## 📊 Monitoring

View logs and usage:

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only sendLoginCode

# Follow logs in real-time
firebase functions:log --follow
```

Check Firebase Console:
- Functions > Dashboard for invocation counts
- Firestore > Data to see loginCodes collection
- Authentication > Users to see logged-in users

## 🎨 Next Steps

Once email auth is working:

1. **Customize email branding** with your company colors/logo
2. **Add rate limiting** for additional security
3. **Set up monitoring alerts** in Firebase Console
4. **Configure backup admin access** in case of SendGrid issues
5. **Add session management** for longer login sessions

---

## Support

For issues:
- Check Firebase Console > Functions > Logs
- Check SendGrid > Activity for email delivery
- Contact support: howard@bluestarequitygroup.com
