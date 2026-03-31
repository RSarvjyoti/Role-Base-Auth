const express = require("express");
const { createAlbum } = require("../controllers/album.controllers");

const router = express.Router();

router.post('/create', createAlbum);

module.exports = router;