const { Router } = require("express");
const { createMusic } = require("../controllers/music.controller");
const multer = require("multer");
const { authArtist } = require("../middleware/auth.middleware");


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", authArtist, upload.single("music"), createMusic);

module.exports = router;