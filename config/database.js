const mongoose = require("mongoose")

let db_url = ""

if (process.env.NODE_ENV === "pro") db_url = process.env.REMOTE_DATABASE_URL || "";
else db_url = "mongodb://127.0.0.1:27017/LyricsDB";

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    await mongoose.connect(db_url)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB;