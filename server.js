const { reset } = require("nodemon");

var request = require("request"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cors = require("cors"),
    app = express();
    
mongoose.connect('mongodb://localhost:27017/futscore_app', { useNewUrlParser: true, useUnifiedTopology: true }); 
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

////////////////////////////////////////////////////LEAGUE AND TEAM LIST////////////////////////////////////////////////////////////////////

//Arrays of top leagues and teams used as dropdown suggestions
var leaguesArray = ["UEFA Champions League", "FIFA World Cup", "Primera Division", "Serie A", "Ligue 1", "Bundesliga", "Primeira Liga", "Eredivisie",
                    "Série A", "Premier League", "Championship", "European Championship"];
                    
var teamsArray = ["Real Madrid", "Barcelona", "Celta Vigo", "Athletic Bilbao", "Atletico Madrid", "Real Betis", "Levante", "Sevilla", "Espanyol",
                  "Getafe CF", "Real Sociedad", "Villareal", "Eibar", "Alaves", "Girona", "Huesca", "Valencia", "Rayo Vallecano", "Valladolid",
                  "Leganes", "Arsenal FC", "Manchester United", "Flamengo", "Vancouver Whitecaps", "Juventus", "Los Angeles FC", "San Jose Earthquakes"];
  
// 2000 = FIFA World Cup
// 2001 = UEFA Champions League               
// 2002 = Bundesliga
// 2003 = Eredivisie (Dutch League)
// 2013 = Série A (Brazilian League)
// 2014 = Primera Division (La Liga)
// 2015 = Ligue 1
// 2016 = Championship
// 2017 = Primeira Liga (Portugese League)
// 2018 = European Championship
// 2019 = Serie A
// 2021 = Premier League

var league_id = {"Bundesliga": 2002, "Eredivisie": 2003, "Brazilian League": 2013, "LaLiga Santander": 2014, "Ligue 1": 2015, "Championship": 2016,
                 "Primeira Liga": 2017, "Serie A": 2019, "Premier League": 2021};
////////////////////////////////////////////////////LEAGUE AND TEAM LIST////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////SCHEMA////////////////////////////////////////////////////////////////////
var favLeaguesSchema = new mongoose.Schema({ league_name: String });
var FavLeagues = mongoose.model("League", favLeaguesSchema);

var favTeamsSchema = new mongoose.Schema({ team_name: String });
var FavTeams = mongoose.model("Team", favTeamsSchema);
////////////////////////////////////////////////////SCHEMA////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////ROUTES////////////////////////////////////////////////////////////////////

// // Sets up the required APIs and renders the main Home Page with all the live match scores
// app.get("/", function(req, res){
//     // football-data.org api config
//     var options = {
//         url: 'https://api.football-data.org/v2/competitions/2001/matches',
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Accept-Charset': 'utf-8',
//             "X-Auth-Token": "788a449190624519aac963d1092782bb"
//         }
//     }
//     // livescore-api.com config (change the 'key' and 'secret' when using a new account)
//     // var url = "http://livescore-api.com/api-client/scores/live.json?key=EErbxKvbb2YpruVU&secret=K9TG6snABVsWVJ4zowKVhg6si5RKANEk";
    
//     League.find({}, function(error, leagues){
//         Team.find({}, function(error, teams) {
//             // request(url, function(error, response, body){
//                 request(options, function(error2, response2, body2){
//                     if (!error2 && response2.statusCode == 200) {
//                         var parsedData2 = JSON.parse(body2);
//                     } else {
//                         console.log("ERROR");
//                     }
//                     // if (!error && response.statusCode == 200) {
//                     //     var parsedData = JSON.parse(body);
//                     // } else {
//                     //     console.log("ERROR");
//                     // }
//                     res.render("index", {body2: parsedData2, leagues: leagues, teams: teams});
//                 });
//         });
//     });
// });

const getFavTeams = async () => {
    const teams = await FavTeams.find({}, (err) => {
        if (err) {
            console.log("ERROR: Failed to fetch favourite teams from database.")
            return
        }
    })
    return teams;
}

const getFavLeagues = async () => {
    const leagues = await FavLeagues.find({}, (err) => {
        // return !err ? leagues : console.log("ERROR: Failed to fetch favourite leagues from database.")
        if (err) {
            console.log("ERROR: Failed to fetch favourite leagues from database.")
            return
        }
    })
    return leagues;
}

const getCurrentDate = () => {
    // current date
    let date_ob = new Date();
    // adjust 0 before single digit date
    let day = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();

    // date in YYYY-MM-DD format
    let date = year + "-" + month + "-" + day;

    return date;
}

app.get("/getFixtures", (req, res) => {

    let date = getCurrentDate();

    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        // qs: {timezone: "America/Toronto"},
        qs: {date: "2022-08-14"},
        headers: {
            'X-RapidAPI-Key': '5UZzmBM8JymshhyLam6aWPoSYtjFp1P0LtwjsnQPZfZbRyQW07',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
            useQueryString: true
        }
    };

    request(options, (err, requestResponse, body) => {
        console.log("error: ", err);
        console.log("statusCode: ", requestResponse && requestResponse.statusCode)

        var data = JSON.parse(body).response;

        (async () => {
            const favLeagues = await getFavLeagues();
            const favTeams = await getFavTeams();
            res.send({"data": data, "favTeams": favTeams, "favLeagues": favLeagues})
        })();
    })
})

app.get("/test", (req, res) => {
    var options = {
        url: 'https://api.football-data.org/v2/competitions/2001/matches',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            "X-Auth-Token": "788a449190624519aac963d1092782bb"
        }
    }
    request(options, (err, response, body) => {
        console.log("error: ", err);
        console.log("statusCode: ", response && response.statusCode);
        // console.log("body: ", JSON.parse(body));
        var data = JSON.parse(body);
        // console.log("body: ", data);
        (async () => {
            const favLeagues = await getFavLeagues();
            const favTeams = await getFavTeams();
            res.send({"data": data, "favLeagues": favLeagues, "favTeams": favTeams})
        })();
    })
})

// Renders the Favourite Leages page by retrieving the leagues located in db
app.get("/fav_leagues", function(req, res) {
    League.find({}, function(error, leagues) {
        if (error) {
            console.log("ERROR!");
        } else {
            res.render("fav_leagues", {leagues: leagues});
        }   
    });
});

// Renders the Favourite Teams page by retrieving the teams located in the db
app.get("/fav_teams", function(req, res) {
    Team.find({}, function(error, teams) {
        if (error) {
            console.log("ERROR!");
        } else {
            res.render("fav_teams", {teams: teams});
        }   
    });
});

// Renders the league standings page corresponding to the league chosen
app.get("/standings/leagues/:league_name", function(req, res) {
    var leagueName = req.params.league_name;
    var leagueID = league_id[leagueName];
    
    // football-data.org API with modified url that points to league standings objects with the corresponding leagueID
    var options = {
        url: 'https://api.football-data.org/v2/competitions/' + leagueID + '/standings',
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
            res.render("standings", {body: parsedData, league_name: leagueName});
        } else {
            console.log("ERROR");
        }
    });
});

// POST request to add new league to db called from Add League page
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

// Renders the Add League page
app.get("/add_league", function(req, res) {
    res.render("add_league", {leagues: leaguesArray});
});

// POST request to add new team to db called from Add Team page
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

// Renders the Add Team page
app.get("/add_team", function(req, res) {
    res.render("add_team", {team: teamsArray});
});

// Removes the selected league and redirects to Favourite Leagues page
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

// Removes the selected team and redirects to Favourite Teams page
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

// Port is currently pointing to 3000 for local testing
app.listen(8080, process.env.IP, function () {
    console.log("The FutScore server has started!");
});
