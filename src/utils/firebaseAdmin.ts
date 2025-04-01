// utils/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json'; // Update the path accordingly

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    // Optionally, add the databaseURL if you're using Realtime Database:
    // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
  });
}

const db = admin.firestore();
export default db;

