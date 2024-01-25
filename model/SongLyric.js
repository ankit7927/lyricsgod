const mongoose = require("mongoose")

const SongLyric = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    singer: {
        type: String,
        required: true
    },
    music_by: {
        type: String,
        required: true
    },
    lyrics_by: {
        type: String,
        required: true
    },
    lyric: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    title: String,
    dic: String,
    category:String,
    img:String,
    release_date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("SongLyric", SongLyric)