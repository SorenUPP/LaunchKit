const { db } = require("../firebaseAdmin");

const userCollection = db.collection("users");
const tokenCollection = db.collection("refreshTokens");

const UserModel = {
    findByEmail: async (email) => {
        const snapshot = await userCollection.where("email", "==", email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    },

    findById: async (id) => {
        const doc = await userCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    create: async (userData) => {
        const docRef = await userCollection.add(userData);
        return { id: docRef.id, ...userData };
    },

    saveRefreshToken: async (userId, token) => {
        await tokenCollection.doc(userId).set({ token, createdAt: Date.now() });
    },

    getRefreshToken: async (userId) => {
        const doc = await tokenCollection.doc(userId).get();
        if (!doc.exists) return null;
        return doc.data().token;
    },

    deleteRefreshToken: async (userId) => {
        await tokenCollection.doc(userId).delete();
    },

    bumpTokenVersion: async (userId) => {
        const doc = await userCollection.doc(userId).get();
        const current = doc.exists ? (doc.data().tokenVersion || 0) : 0;
        await userCollection.doc(userId).update({ tokenVersion: current + 1 });
    },
};

module.exports = UserModel;