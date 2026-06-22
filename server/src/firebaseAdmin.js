const { cert, initializeApp, getApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { getAuth, db };