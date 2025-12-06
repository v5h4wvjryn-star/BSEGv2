const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Resend } = require('resend');

admin.initializeApp();

// Whitelist of authorized emails
const AUTHORIZED_EMAILS = [
  'howard@bluestarequitygroup.com',  // Primary admin
  // Add more authorized emails here:
  // 'admin2@bluestarequitygroup.com',
  // 'hr@bluestarequitygroup.com',
];

// Initialize Resend (API key will be set via environment variable)
const resend = new Resend(functions.config().resend?.key || process.env.RESEND_API_KEY);

/**
 * Cloud Function: Send login code via email
 * Callable from frontend
 */
exports.sendLoginCode = functions.https.onCall(async (data, context) => {
  const email = data.email?.toLowerCase().trim();

  // Validate email format
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid email address');
  }

  // Check if email is authorized
  if (!AUTHORIZED_EMAILS.includes(email)) {
    throw new functions.https.HttpsError('permission-denied', 'Access denied. Only authorized users can log in.');
  }

  try {
    // Generate random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in Firestore with 10-minute expiration
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    );

    await admin.firestore().collection('loginCodes').doc(email).set({
      code: code,
      email: email,
      expiresAt: expiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Send email via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default sender
      to: email,
      subject: 'Your Blue Star Equity Group Admin Login Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: #fbbf24; padding: 20px; text-align: center; }
            .code-box { background: #f3f4f6; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937; }
            .footer { color: #6b7280; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⭐ Blue Star Equity Group</h1>
            </div>
            <h2>Admin Login Code</h2>
            <p>Your verification code is:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Blue Star Equity Group. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return {
      success: true,
      message: 'Code sent successfully',
      email: email
    };

  } catch (error) {
    console.error('Error sending login code:', error);

    // Handle Resend-specific errors
    if (error.message?.includes('API key')) {
      throw new functions.https.HttpsError('unavailable', 'Email service configuration error. Please contact support.');
    }

    throw new functions.https.HttpsError('internal', 'Failed to send login code');
  }
});

/**
 * Cloud Function: Verify login code
 * Callable from frontend
 */
exports.verifyLoginCode = functions.https.onCall(async (data, context) => {
  const email = data.email?.toLowerCase().trim();
  const code = data.code?.trim();

  if (!email || !code) {
    throw new functions.https.HttpsError('invalid-argument', 'Email and code are required');
  }

  try {
    const docRef = admin.firestore().collection('loginCodes').doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError('not-found', 'Invalid or expired code');
    }

    const data = doc.data();
    const now = admin.firestore.Timestamp.now();

    // Check if code has expired
    if (now.toMillis() > data.expiresAt.toMillis()) {
      await docRef.delete(); // Clean up expired code
      throw new functions.https.HttpsError('deadline-exceeded', 'Code has expired. Please request a new one.');
    }

    // Verify code matches
    if (data.code !== code) {
      throw new functions.https.HttpsError('permission-denied', 'Invalid code');
    }

    // Code is valid - delete it (one-time use)
    await docRef.delete();

    // Create a custom token for the user
    const customToken = await admin.auth().createCustomToken(email);

    return {
      success: true,
      message: 'Login successful',
      token: customToken,
      email: email
    };

  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    console.error('Error verifying login code:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify code');
  }
});

/**
 * Scheduled function: Clean up expired login codes
 * Runs every hour
 */
exports.cleanupExpiredCodes = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const snapshot = await admin.firestore()
      .collection('loginCodes')
      .where('expiresAt', '<', now)
      .get();

    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} expired codes`);

    return null;
  });
