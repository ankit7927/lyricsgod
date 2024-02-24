require("dotenv").config()
var express = require("express");
const mongoose = require("mongoose")
const connectDB = require("./config/database");
const path = require('path')
const hbs = require("hbs");

const port = process.env.PORT || 5000

app = express();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev') {
    var logger = require("morgan");
    app.use(logger("dev")); 
}
app.use("/images", express.static(path.resolve("images")))
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

connectDB()

require("./config/hbsConfig")

app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, "views/partials"))

app.use("", require("./routes/publicRoute"))
app.use("/api", require("./routes/publicRoute"))
app.use("/private", require("./routes/privateRoute"))

app.use("*", (req, res) => {
    res.render("notFound")
})

mongoose.connection.once("open", () => {
    console.log("connected to database");
    app.listen(port, () => {
        console.log(`server started on ${port}`);
    });
})

mongoose.connection.on("error", (error) => {
    console.log(error);
})