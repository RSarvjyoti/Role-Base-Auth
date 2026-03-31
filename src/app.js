const express = require("express");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const musicRoute = require("./routes/music.routes");
const albumRoute = require("./routes/album.routes")

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/music', musicRoute);
app.use("/api/album", albumRoute);


module.exports = app