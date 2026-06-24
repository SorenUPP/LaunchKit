const { cert, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Missing env var: FIREBASE_SERVICE_ACCOUNT");
}

let serviceAccount;
try {
     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
}

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { getAuth, db };