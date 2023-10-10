var mongoose = require("mongoose");

var favTeamsSchema = new mongoose.Schema({
    team_id: Number,
    name: String,
    country: String,
    logo: String
});

module.exports = mongoose.model("Team", favTeamsSchema);