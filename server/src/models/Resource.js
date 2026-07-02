const { db } = require("../firebaseAdmin");
const resourceCollection = db.collection("resources");

const ResourceModel = {
    findById: async (id) => {
        const doc = await resourceCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },
    findByType: async (type) => {
        const snapshot = await resourceCollection.where("type", "==", type).get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
};

module.exports = ResourceModel;