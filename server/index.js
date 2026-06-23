require("dotenv").config();
const app = require("./server.js");
console.log("Imported app:", typeof app);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});