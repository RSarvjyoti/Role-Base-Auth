const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const musicRouter = require("./routes/music.routes")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/music', musicRouter);

module.exports = app