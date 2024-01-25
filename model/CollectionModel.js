const mongoose = require("mongoose")

const CollectionModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dic: String,
    img:String,
    songs:[String]
})

module.exports = mongoose.model("Collection", CollectionModel)