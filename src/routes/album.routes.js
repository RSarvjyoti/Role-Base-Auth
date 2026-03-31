const express = require("express");
const { createAlbum, getAllAlbum } = require("../controllers/album.controllers");
const { authArtist, authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/create', authArtist, createAlbum);
router.get('/', authUser, getAllAlbum);

module.exports = router;