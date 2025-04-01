import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  let serviceAccount: admin.ServiceAccount;

  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    // ✅ Load from env var (for Vercel or Docker)
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
  } else {
    // ✅ Load from local file (for local dev)
    const filePath = path.resolve(process.cwd(), 'firebase/serviceAccountKey.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    serviceAccount = JSON.parse(fileContents);
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: 'https://<your-project-id>.firebaseio.com' // Optional
  });
}

const db = admin.firestore();
export default db;
