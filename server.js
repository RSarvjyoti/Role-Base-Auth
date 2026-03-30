const app = require("./src/app");
const connectDb = require("./src/config/db");
require("dotenv").config();

const PORT = process.env.PORT || 3001
const DB_URL = process.env.DB_URL

app.listen(PORT, (req, res) => {
    console.log(`Server is runing at http://localhost:${PORT}`);
    connectDb(DB_URL);
})