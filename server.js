const { reset } = require("nodemon");

var request = require("request"),
    axios = require("axios"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cors = require("cors"),

    data = require("./todaysMatches.json"),
    allTeamsJSON = require("./allTeams.json"),
    allLeaguesJSON = require("./allLeagues.json"),

    app = express();
    
mongoose.connect('mongodb://localhost:27017/futscore_app', { useNewUrlParser: true, useUnifiedTopology: true }); 
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
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
var favLeaguesSchema = new mongoose.Schema({
    id: Number,
    name: String,
    country: String,
    flag: String,
    logo: String
});
var FavLeagues = mongoose.model("League", favLeaguesSchema);

var favTeamsSchema = new mongoose.Schema({
    team_id: Number,
    name: String,
    country: String,
    logo: String
});
var FavTeams = mongoose.model("Team", favTeamsSchema);
////////////////////////////////////////////////////SCHEMA////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////ROUTES////////////////////////////////////////////////////////////////////

const getFavTeams = async (matches) => {
    let teams = await FavTeams.find({}, (err) => {
        if (err) {
            console.log("ERROR: Failed to fetch favourite teams from database.")
            return
        }
    })
    // converts all mongoose objects to javascript objects
    teams = teams.map(team => (team.toObject()))

    // Adds matches for each league in a new field (matches) inside favLeagues
    teams.map(team => (
        team.match = getTeamMatch(team, matches)
    ))

    return teams;
}

const getTeamMatch = (team, matches) => {
    for (let match of matches) {
        if (match.teams.home.id === team.team_id || match.teams.away.id === team.team_id) {
            return match;
        }  
    }
    return null;
}

// Adds match for each team if they play that day in a new field (match) inside favTeams
const getFavTeamsMatches = (favTeams) => {
    return Array.from(
        new Set(
            favTeams.flatMap(team => (
                team.match ? team.match : []
            ))
        )
    )
}

const getFavLeagues = async (matches) => {
    let leagues = await FavLeagues.find({}, (err) => {
        // return !err ? leagues : console.log("ERROR: Failed to fetch favourite leagues from database.")
        if (err) {
            console.log("ERROR: Failed to fetch favourite leagues from database.")
            return
        }
    })
    // converts all mongoose objects to javascript objects
    leagues = leagues.map(league => (league.toObject()))

    // Adds matches for each league in a new field (matches) inside favLeagues
    leagues.map(league => (
        league.matches = getLeagueMatches(league, matches)
    ))
    return leagues;
}

const getLeagueMatches = (league, matches) => {
    return matches.flatMap(match => (
        (match.league.id === league.id) ? match : []
    ))
}

const getAllOtherLeaguesMatches = (matches, favLeagues, limit) => {
    const map = new Map();
    const favLeaguesIds = favLeagues.map(league => league.id);
    let numOfMatches = 0;

    for (let match of matches) {
        if (numOfMatches >= limit) {
            break;
        }
        if (!favLeaguesIds.includes(match.league.id)) {
            if (map.has(match.league.id)) {
                map.set(
                    match.league.id, {
                    ...map.get(match.league.id),
                    matches: [...map.get(match.league.id).matches, match]
                }
                );
            } else {
                map.set(
                    match.league.id, {
                        id: match.league.id,
                        name: match.league.name,
                        country: match.league.country,
                        flag: match.league.flag,
                        logo: match.league.logo,
                        matches: [match]
                    }
                );
            }
            numOfMatches++;
        }
    }
    console.log("length: ", [...map.values()].length)
    console.log("numOfMatches: ", numOfMatches)
    return [...map.values()];
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

app.get("/getFixtures", async (req, res) => {

    const test = false;

    if (test) {
        const matchesLimit = 200;

        const favTeams = await getFavTeams(data.data);
        const favLeagues = await getFavLeagues(data.data);
        const favTeamsMatches = await getFavTeamsMatches(favTeams);
        const allOtherLeagues = await getAllOtherLeaguesMatches(data.data, favLeagues, matchesLimit);
        res.send({"data": data.data, "favTeams": favTeams, "favLeagues": favLeagues, "favTeamsMatches": favTeamsMatches, "allOtherLeagues": allOtherLeagues})
    } else {
        let date = getCurrentDate();

        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: {date: date, timezone: "America/Toronto"},
            headers: {
                'X-RapidAPI-Key': '5UZzmBM8JymshhyLam6aWPoSYtjFp1P0LtwjsnQPZfZbRyQW07',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                useQueryString: true
            }
        };
        
        const result = await axios.request(options);
        const data = result.data.response;

        const matchesLimit = 200;

        const favTeams = await getFavTeams(data);
        const favLeagues = await getFavLeagues(data);
        const favTeamsMatches = await getFavTeamsMatches(favTeams);
        const allOtherLeagues = await getAllOtherLeaguesMatches(data, favLeagues, matchesLimit);
        res.send({ "data": data, "favTeams": favTeams, "favLeagues": favLeagues, "favTeamsMatches": favTeamsMatches, "allOtherLeagues": allOtherLeagues });
    }
})

// Would have to run this every new season to get the latest teams in each league
app.get("/getAllTeams", async (req, res) => {
    // const options = {
    //     method: 'GET',
    //     url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
    //     params: { league: 78, season: "2022" },
    //     headers: {
    //         'X-RapidAPI-Key': '5UZzmBM8JymshhyLam6aWPoSYtjFp1P0LtwjsnQPZfZbRyQW07',
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         useQueryString: true
    //     }
    // }

    // let result = await axios.request(options);
    // result = result.data.response;
    // res.send(result);
    res.send(allTeamsJSON);
})

app.get("/getAllLeagues", (req, res) => {
    // const options = {
    //     method: 'GET',
    //     url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    //     headers: {
    //         'X-RapidAPI-Key': '5UZzmBM8JymshhyLam6aWPoSYtjFp1P0LtwjsnQPZfZbRyQW07',
    //         'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    //         useQueryString: true
    //     }
    // }
    // axios.request(options).then(result => {
    //     res.send(result.data.response)
    // })

    res.send(allLeaguesJSON);
})

app.post("/addTeam", (req, res) => {
    for (let i in req.body) {
        let favTeam = new FavTeams({
            team_id: req.body[i].id,
            name: req.body[i].name,
            country: req.body[i].country,
            logo: req.body[i].logo
        })
        favTeam.save((err) => {
            if (err) {
                console.log("Failed to add new favourited team to database.");
                return err;
            }
            console.log("Added new favourited team to database.", favTeam)
        })
    }
    res.status(201).json(req.body);
})

app.post("/addLeague", (req, res) => {
    for (let i in req.body) {
        let favLeague = new FavLeagues({
            id: req.body[i].id,
            name: req.body[i].name,
            country: req.body[i].country,
            flag: req.body[i].flag,
            logo: req.body[i].logo
        })
        favLeague.save((err) => {
            if (err) {
                console.log("Failed to add new favourited league to database.");
                return err;
            }
            console.log("Added new favourited league to database.", favLeague)
        })
    }
    res.status(201).json(req.body);
})

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
