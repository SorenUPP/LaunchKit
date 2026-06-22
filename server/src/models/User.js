const { db } = require("../firebaseAdmin");

const userCollection = db.collection("users");

const UserModel = {
    findByEmail: async (email) => {
        const snapshot = await userCollection.where("email", "==", email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    },

    create: async (userData) => {
        const docRef = await userCollection.add(userData);
        return { id: docRef.id, ...userData };
    },
};

module.exports = UserModel;