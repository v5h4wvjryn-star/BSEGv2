# Firebase Setup Instructions

This application uses Firebase for authentication and data storage. Follow these steps to configure Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

## 2. Enable Firebase Services

### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable "Anonymous" authentication
4. (Optional) Enable "Custom Token" if you plan to use it

### Firestore Database
1. Go to "Firestore Database"
2. Click "Create Database"
3. Choose production mode
4. Select a location closest to your users

## 3. Set Up Security Rules

In Firestore, add the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public job listings
    match /artifacts/{appId}/public/data/jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Configure Your Application

The app expects Firebase config to be provided via global variables. You have two options:

### Option A: Embedded in HTML (for testing)

Add this to your `index.html` before the closing `</head>` tag:

```html
<script>
  window.__firebase_config = JSON.stringify({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  });
  window.__app_id = "bseg-v2"; // Your app identifier
</script>
```

### Option B: Environment Variables (recommended for production)

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_APP_ID=bseg-v2
```

Then update `src/App.jsx` to use environment variables:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const appId = import.meta.env.VITE_APP_ID || 'default-app-id';
```

## 6. Deploy Firestore Indexes (if needed)

If you get index-related errors, Firebase will provide a direct link in the console error message to create the required index.

## Admin Access

The admin job posting page is protected with email/code authentication:
- Authorized email: `howard@bluestarequitygroup.com`
- Simulated code: `123456`

To change this, update the `AUTHORIZED_EMAIL` and `SIMULATED_CODE` constants in the `PrivateJobPost` component.

## Firestore Data Structure

```
/artifacts/{appId}/public/data/jobs/{jobId}
  - title: string
  - company: string
  - location: string
  - description: string
  - datePosted: timestamp
```

## Testing Locally

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open http://localhost:5173

## GitHub Pages Deployment

The GitHub Actions workflow will automatically deploy to GitHub Pages when you push to the main branch. Make sure to:

1. Go to repository Settings > Pages
2. Select "GitHub Actions" as the source
3. Your site will be available at: `https://[username].github.io/BSEGv2/`

## Custom Domain Setup

To use a custom domain:

1. Go to repository Settings > Pages
2. Add your custom domain
3. Update `base` in `vite.config.js` to `/` instead of `/BSEGv2/`
4. Add a CNAME file in the `public` folder with your domain name
