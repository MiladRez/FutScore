var mongoose = require("mongoose");

var favLeaguesSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country: String,
    flag: String,
    logo: String
});

module.exports = mongoose.model("League", favLeaguesSchema)