const express = require("express");
const { createAlbum, getAllAlbum, getAlbumById } = require("../controllers/album.controllers");
const { authArtist, authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/create', authArtist, createAlbum);
router.get('/', authUser, getAllAlbum);
router.get('/album/:albumId', getAlbumById)

module.exports = router;