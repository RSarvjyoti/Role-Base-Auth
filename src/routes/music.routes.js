const { Router } = require("express");
const { createMusic, getAllMusics } = require("../controllers/music.controller");
const multer = require("multer");
const { authArtist, authUser } = require("../middleware/auth.middleware");


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", authArtist, upload.single("music"), createMusic);
router.get('/', authUser, getAllMusics)

module.exports = router;