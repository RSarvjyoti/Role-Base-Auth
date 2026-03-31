const express = require("express");
const { createAlbum } = require("../controllers/album.controllers");
const { authArtist } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/create', authArtist, createAlbum);

module.exports = router;