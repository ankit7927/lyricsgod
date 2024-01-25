const asyncHandler = require("express-async-handler");
const CollectionModel = require("../model/CollectionModel");
const SongLyric = require("../model/SongLyric");

const privateController = {}

privateController.addSong = asyncHandler(async (req, res) => {
    const songDetail = { name, singer, music_by, lyrics_by, lyric, album, release_date, dic, title, category } = req.body;

    if (!name || !singer || !music_by || !lyric || !lyrics_by || !album || !release_date)
        return res.status(400).json({ message: "all fields required" })

    const exist = await SongLyric.findOne({ name: name }).lean().exec()

    if (exist) return res.status(400).json({ message: 'song alredy exist' });

    if (!title) songDetail.title = name + " song lyrics by " + singer + " - " + album

    songDetail.img = `${req.protocol}://${req.headers.host}/images/${req.file.originalname}`;
    songDetail.release_date = new Date(release_date).toLocaleDateString()

    const newSong = await SongLyric.create(songDetail)

    if (newSong) res.status(201).json({ message: "song created" })
    else res.status(400).json({ message: "invalid song data received" })
})

privateController.getAll = asyncHandler(async (req, res) => {
    res.send(await SongLyric.find())
})

privateController.getSongByID = asyncHandler(async (req, res) => {
    res.send(await SongLyric.findOne({ _id: req.params.songID }))
})


privateController.updateSong = asyncHandler(async (req, res) => {
    const { songID, name, singer, music_by, lyrics_by, lyric, album, release_date, dic, title, category } = req.body;

    if (!songID) return res.status(400).json({ message: 'songID is required' });

    let existingSong = await SongLyric.findById({ _id: songID }).exec()

    if (!existingSong) return res.status(400).json({ message: 'song not found' });

    existingSong.name = name || existingSong.name
    existingSong.singer = singer || existingSong.singer
    existingSong.music_by = music_by || existingSong.music_by
    existingSong.lyrics_by = lyrics_by || existingSong.lyrics_by
    existingSong.lyric = lyric || existingSong.lyric
    existingSong.album = album || existingSong.album
    existingSong.release_date = release_date || existingSong.release_date
    existingSong.dic = dic || existingSong.dic
    existingSong.title = title || existingSong.title
    existingSong.category = category || existingSong.category
    existingSong.img = `${req.protocol}://${req.headers.host}/images/${req.file.originalname}` || existingSong.img

    const updatedSong = await existingSong.save()

    res.json(updatedSong)
})

privateController.deleteSong = asyncHandler(async (req, res) => {
    const { songID } = req.body;

    if (!songID) return res.status(400).json({ message: 'songID is required' });

    const red = await SongLyric.deleteOne({ _id: songID })

    res.send(red)
})

privateController.createCollection = asyncHandler(async (req, res) => {
    let collDetail = { title, dic } = req.body;
    if (!title || !dic) return res.status(400).json({ message: "all fields required" })

    const exist = await CollectionModel.findOne({ title: title }).lean().exec()

    if (exist) return res.status(400).json({ message: 'Collection alredy exist' });

    collDetail.img = `${req.protocol}://${req.headers.host}/images/${req.file.originalname}`;

    const newColl = await CollectionModel.create(collDetail)

    if (newColl) res.status(201).json({ message: "song created" })
    else res.status(400).json({ message: "invalid collection data received" })
})


privateController.updateCollection = asyncHandler(async (req, res) => {
    const { collID, title, dic } = req.body;

    if (!title || !dic || !collID) return res.status(400).json({ message: "all fields required" })

    const exist = await CollectionModel.findOne({ _id: collID }).exec()

    if (!exist) return res.status(400).json({ message: 'Collection does not exist' });

    exist.title = title;
    exist.dic = dic
    exist.img = `${req.protocol}://${req.headers.host}/images/${req.file.originalname}`

    const updateColl = await exist.save()

    res.json(updateColl)
})

privateController.getAllColl = asyncHandler(async (req, res) => {
    res.send(await CollectionModel.find())
})

privateController.getCollByID = asyncHandler(async (req, res) => {
    const coll = await CollectionModel.findOne({ _id: req.params.collID })
    if (coll === null) return res.status(400).json({ message: "collection not found" })
    res.send(coll)
})

privateController.deleteColl = asyncHandler(async (req, res) => {
    const red = await CollectionModel.deleteOne({ _id: req.params.collID })

    res.send(red)
})


privateController.addSongToColl = asyncHandler(async (req, res) => {
    const { collID, songNames } = req.body;

    const exist = await CollectionModel.findOne({ _id: collID }).select("songs").exec()

    if (!exist) return res.status(400).json({ message: 'Collection does not exist' });

    let nameList = songNames.split(";")

    nameList = nameList.filter((song) => exist.songs.indexOf(song) == -1)

    if (nameList.length === 0) return res.json({ message: 'songs already added' });

    const SongList = await SongLyric.find({
        name: {
            $in: nameList
        }
    }).select("name").lean()

    SongList.map(song => exist.songs.push(song.name))

    const updated = await exist.save()

    res.json(updated)
})

privateController.removeSongFromColl = asyncHandler(async (req, res) => {
    const { collID, songNames } = req.body;

    let exist = await CollectionModel.findOne({ _id: collID }).select("songs").exec()

    if (!exist) return res.status(400).json({ message: 'Collection does not exist' });

    const nameList = songNames.split(";")

    exist.songs = exist.songs.filter((song) => nameList.indexOf(song) == -1)

    const update = await exist.save()

    res.json(update)
})

module.exports = privateController;