var express = require("express");
const privateController = require("../controllers/privateController");
const upload = require("../middleware/mediaHelper");
const router = express.Router()

router.route("/song")
    .get(privateController.getAll)
    .post(upload.single("song-image"), privateController.addSong)
    .patch(privateController.updateSong)
    .delete(privateController.deleteSong)

router.route("/song/:songID")
    .get(privateController.getSongByID)

router.route("/coll")
    .get(privateController.getAllColl)
    .post(upload.single("coll-image"), privateController.createCollection)
    .patch(upload.single("coll-image"), privateController.updateCollection)
    .delete(privateController.deleteColl)

router.route("/coll/song")
    .post(privateController.addSongToColl)
    .delete(privateController.removeSongFromColl)

router.route("/coll/:collID")
    .get(privateController.getCollByID)
    .delete(privateController.deleteColl)

module.exports = router;