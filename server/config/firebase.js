const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

let db;

try {
  // Check if already initialized to avoid hot-reloading errors
  if (!admin.apps.length) {
    const serviceAccountKeyPath = path.join(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountKeyPath)) {
      const serviceAccount = require(serviceAccountKeyPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin Initialized with serviceAccountKey.json');
      db = admin.firestore();
    } else {
      console.warn('⚠️  WARNING: No serviceAccountKey.json found.');
      console.warn('⚠️  Using IN-MEMORY MOCK DATABASE. Data will be lost on restart.');
      
      // We still init app for Auth verification (might fail if no creds, but let's try)
      // If auth ALSO fails, we might need to mock auth middleware too.
      try {
        admin.initializeApp({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'budgettracker-2225c'
        });
      } catch (e) { console.error("Auth init failed", e.message); }

      // Use Mock DB
      const { MockFirestore } = require('../utils/mockFirestore');
      db = new MockFirestore();
    }
  } else {
    // Already init
    try {
        db = admin.firestore();
    } catch(e) {
        // Fallback if existing app is broken
        const { MockFirestore } = require('../utils/mockFirestore');
        db = new MockFirestore();
    }
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error.message);
  const { MockFirestore } = require('../utils/mockFirestore');
  db = new MockFirestore();
}

module.exports = { admin, db };
