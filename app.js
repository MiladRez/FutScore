var request = require("request"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();
    
mongoose.connect('mongodb://localhost:27017/futscore_app', { useNewUrlParser: true }); 
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

////////////////////////////////////////////////////LEAGUE AND TEAM LIST////////////////////////////////////////////////////////////////////
var leaguesArray = ["Champions League", "Europa League", "LaLiga Santander", "Serie A", "Ligue 1", "Bundesliga", "Major League Soccer",
                    "Confederations Cup", "World Cup", "Copa del Rey", "Primeira Liga", "Serie B", "Coppa Italia", "DFB Cup", "2nd Bundesliga", 
                    "Ligue 2 ", "FA Cup", "CONCACAF", "K-League 1"];
                    
var teamsArray = ["Real Madrid", "FC Barcelona", "Celta Vigo", "Athletic Bilbao", "Atletico Madrid", "Real Betis", "Levante", "Sevilla", "Espanyol",
                  "Getafe CF", "Real Sociedad", "Villareal", "Eibar", "Alaves", "Girona", "Huesca", "Valencia", "Rayo Vallecano", "Valladolid",
                  "Leganes", "Arsenal FC", "Manchester United", "Flamengo", "Vancouver Whitecaps", "Juventus", "Los Angeles FC", "San Jose Earthquakes"];
////////////////////////////////////////////////////LEAGUE AND TEAM LIST////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////SCHEMA////////////////////////////////////////////////////////////////////
var leagueSchema = new mongoose.Schema({
    league_name: String
});

var League = mongoose.model("League", leagueSchema);

var teamSchema = new mongoose.Schema({
    team_name: String
});

var Team = mongoose.model("Team", teamSchema);
////////////////////////////////////////////////////SCHEMA////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////ROUTES////////////////////////////////////////////////////////////////////
app.get("/", function(req, res){
    League.find({}, function(error, leagues){
        Team.find({}, function(error, teams) {
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
    res.redirect("/fav_teams");
    } else {
        console.log("Invalid/Unsupported Team!");
        res.redirect("/add_team");
    }
});

app.get("/add_team", function(req, res) {
    res.render("add_team", {team: teamsArray});
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

app.get("/fav_teams", function(req, res) {
    Team.find({}, function(error, teams) {
        if (error) {
            console.log("ERROR!");
        } else {
            res.render("fav_teams", {teams: teams});
        }   
    });
});

app.get("/standings", function(req, res) {
    var options = {
        url: 'https://api.football-data.org/v2/competitions/2021/standings',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            "X-Auth-Token": "788a449190624519aac963d1092782bb"
        }
    }
    request(options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            res.render("standings", {body: parsedData});
            console.log(parsedData);
        } else {
            console.log("ERROR");
        }
    });
});

app.get("/remove/leagues/:league_name", function(req, res){
    var leagueName = req.params.league_name;
    League.deleteOne({league_name: leagueName}, function(err, removedLeague){
        if (err){
            console.log("ERROR!");
        } else {
            console.log("=======================");
            console.log("Removed League");
            console.log("=======================");
            console.log(removedLeague);
            res.redirect("/fav_leagues");
        }
    });
});

app.get("/remove/teams/:team_name", function(req, res){
    var teamName = req.params.team_name;
    Team.deleteOne({team_name: teamName}, function(err, removedTeam){
        if (err){
            console.log("ERROR!");
        } else {
            console.log("=======================");
            console.log("Removed Team");
            console.log("=======================");
            console.log(removedTeam);
            res.redirect("/fav_teams");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The FutScore server has started!");
});