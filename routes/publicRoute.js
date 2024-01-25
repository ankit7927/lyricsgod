var express = require("express");
const publicController = require("../controllers/publicController");
const router = express.Router()

router.route("")
    .get(publicController.index)

router.route("/search")
    .get(publicController.search)

router.route("/songs")
    .get(publicController.songs)

router.route("/albums")
    .get(publicController.albums)

router.route("/album/:albumName")
    .get(publicController.albumSong)

router.route("/collections")
    .get(publicController.collection)

router.route("/collection/:collName")
    .get(publicController.collectionSongs)

router.route("/lyric/:songName")
    .get(publicController.songByName)

module.exports = router;