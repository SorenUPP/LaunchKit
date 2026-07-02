const { db } = require("../firebaseAdmin");
const serviceCollection = db.collection("services");

const ServiceModel = {
    findbyId: async (id) => {
        const doc = await serviceCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },
    findAll: async () => {
        const snapshot = await serviceCollection.get();
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
};

module.exports = ServiceModel;