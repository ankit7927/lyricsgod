const mongoose = require("mongoose")

const SongLyric = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    singer: String,
    music_by: String,
    lyrics_by: String,
    lyric: {
        type: String,
        required: true
    },
    album: String,
    title: String,
    category: String,
    img: String,
    release_date: Date
})

module.exports = mongoose.model("SongLyric", SongLyric)