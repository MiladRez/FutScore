var request = require("request"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();
    
mongoose.connect('mongodb://localhost:27017/futscore_app', { useNewUrlParser: true }); 
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var leaguesArray = ["Champions League", "Europa League", "LaLiga Santander", "Serie A", "Ligue 1", "Bundesliga", "Major League Soccer",
                    "Confederations Cup", "World Cup", "Copa del Rey", "Primeira Liga", "Serie B", "Coppa Italia", "DFB Cup", "2nd Bundesliga", 
                    "Ligue 2 ", "FA Cup", "CONCACAF", "Superliga"];
                    
var teamsArray = ["Real Madrid", "Flamengo"];

var leagueSchema = new mongoose.Schema({
    league_name: String
});

var League = mongoose.model("League", leagueSchema);

var teamSchema = new mongoose.Schema({
    team_name: String
});

var Team = mongoose.model("Team", teamSchema);

app.post("/add_league", function(req, res) {
    var leagueName = req.body.leaguename;
    
    if (leaguesArray.includes(leagueName)) {
        League.create({league_name: leagueName}, function(err, league){
            if(err){
                console.log("ERROR!");
            } else {
                console.log("=======================");
                console.log("Added League");
                console.log("=======================");
                console.log(league);
            }
        });
    res.redirect("/fav_leagues");
    } else {
        console.log("Invalid/Unsupported League!");
        res.redirect("/add_league");
    }
});

app.get("/add_league", function(req, res) {
    res.render("add_league", {leagues: leaguesArray});
});

app.post("/add_team", function(req, res) {
    var teamName = req.body.teamname;
    
    if (teamsArray.includes(teamName)) {
        Team.create({team_name: teamName}, function(err, team){
            if(err){
                console.log("ERROR!");
            } else {
                console.log("=======================");
                console.log("Added Team");
                console.log("=======================");
                console.log(team);
            }
        });
    res.redirect("/fav_leagues");
    } else {
        console.log("Invalid/Unsupported Team!");
        res.redirect("/add_team");
    }
});

app.get("/add_team", function(req, res) {
    res.render("add_team", {team: teamsArray});
});

app.get("/", function(req, res){
    League.find({}, function(error, leagues){
        Team.find({}, function(teams) {
            request("http://livescore-api.com/api-client/scores/live.json?key=fyZ6Y0JVL0azKSnb&secret=qMKEBfegENcJK0U0yU7wVRsGRCfCuCOV", function(error, response, body){
                if (!error && response.statusCode == 200) {
                    var parsedData = JSON.parse(body);
                    res.render("index", {body: parsedData, leagues: leagues, teams: teams});
                } else {
                    console.log("ERROR");
                }
            });
        });
    });
});

app.get("/fav_leagues", function(req, res) {
    League.find({}, function(error, leagues) {
        if (error) {
            console.log("ERROR!");
        } else {
            res.render("fav_leagues", {leagues: leagues});
        }   
    });
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The FutScore server has started!");
});