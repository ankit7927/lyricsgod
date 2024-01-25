const asyncHandler = require("express-async-handler");
const CollectionModel = require("../model/CollectionModel");
const SongLyric = require("../model/SongLyric");
const publicController = {}

publicController.index = asyncHandler(async (req, res) => {
    let data = {}

    data.featured = await SongLyric.aggregate([
        { $sample: { size: 7 } },
        { $project: { "name": 1, "img": 1 } }
    ])

    data.latest = await SongLyric.find({}).sort("release_date")
        .select("name singer album img").lean().limit(10)

    data.collection = await CollectionModel.aggregate([
        { $sample: { size: 6 } },
        { $project: { "title": 1, "img": 1 } }
    ])

    data.randomSongs = await SongLyric.aggregate([
        { $sample: { size: 12 } },
        { $project: { "name": 1, "img": 1 } }
    ])

    res.render("index", data)
})


publicController.songByName = asyncHandler(async (req, res) => {

    let songData = {}
    songData = await SongLyric.findOne({ name: req.params.songName }).lean().exec()

    if (!songData) res.send("song not found")

    songData.release_date = new Date(songData.release_date).getFullYear()

    songData.more_by_singer = await SongLyric.find({
        "singer": {
            $regex: songData.singer
        }
    }).select("name album").lean().limit(7).sort("release_date")

    songData.more_album_song = await SongLyric.find({ album: songData.album })
        .select("name singer").limit(7).lean().exec()


    res.render("song", songData)
})


publicController.search = asyncHandler(async (req, res) => {

    const { songQuery } = req.query;

    const result = {}

    result.result = await SongLyric.find({
        "$or": [
            {
                "name": {
                    $regex: songQuery
                }
            },
            {
                "singer": {
                    $regex: songQuery
                }
            },
            {
                "title": {
                    $regex: songQuery
                }
            },
            {
                "dic": {
                    $regex: songQuery
                }
            },
            {
                "lyric": {
                    $regex: songQuery
                }
            }
        ]
    }).select("name album singer img").lean()

    result.query = songQuery

    res.render("search", result)
})


publicController.collection = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 20;

    const response = {}
    response.collectios = await CollectionModel.find()
        .select("title img")
        .limit(limit * 1)
        .skip((parseInt(page) - 1) * limit)
        .lean().exec();
    const count = await CollectionModel.countDocuments();
    response.totalPage = [...Array(Math.ceil(count / limit)).keys()]
    response.currentPage = page
    res.render("collections", response)
})


publicController.songs = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 40;

    const result = {}

    result.songs = await SongLyric.find()
        .select("name img")
        .limit(limit * 1)
        .skip((parseInt(page) - 1) * limit)
        .lean()
        .exec();

    const count = await SongLyric.countDocuments();

    result.totalPage = [...Array(Math.ceil(count / limit)).keys()]
    result.currentPage = page

    res.render("songs", result)
})


publicController.albums = asyncHandler(async (req, res) => {
    const result = {}

    result.albums = await SongLyric.find()
        .select("album")
        .sort("album")
        .distinct("album")
        .lean()

    res.render("albums", result)
})

publicController.albumSong = asyncHandler(async (req, res) => {
    const albumName = req.params.albumName;
    const response = {}
    response.title = albumName
    response.albumSongs = await SongLyric.find({ album: albumName })
        .select("name img singer release_date")
        .lean().exec()
    res.render("albumSongs", response)
})

publicController.collectionSongs = asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 40;
    const collName = req.params.collName;
    const response = {}
    
    response.collection = await CollectionModel.findOne({ title: collName })
        .limit(limit * 1)
        .skip((parseInt(page) - 1) * limit)
        .lean().exec()

    if (response.collection === null) return res.render("notFound")

    response.songs = await SongLyric.find({ name: { $in: response.collection.songs } })
        .select("name img").lean()

    const count = response.collection.songs.length()
    response.totalPage = [...Array(Math.ceil(count / limit)).keys()]
    response.currentPage = page
    res.render("collectionSongs", response)
})

module.exports = publicController;