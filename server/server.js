const { reset } = require("nodemon");

var request = require("request"),
    axios = require("axios"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    FavTeams = require("./schemaModels/favTeamsModel"),
    FavLeagues = require("./schemaModels/favLeaguesModel"),
    cors = require("cors"),

    { getFavTeams, getFavLeagues, getFavTeamsMatches, getAllOtherLeaguesMatches, getCurrentDate } = require("./utils/consolidateDataHelperFuncs.js"),

    data = require("./jsonFiles/todaysMatches.json"),
    allTeamsJSON = require("./jsonFiles/allTeams.json"),
    allLeaguesJSON = require("./jsonFiles/allLeagues.json"),

    app = express();
    
mongoose.connect('mongodb://localhost:27017/futscore_app', { useNewUrlParser: true, useUnifiedTopology: true }); 
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

const url = "https://api-football-v1.p.rapidapi.com/v3";
const X_RapidAPI_Key = "5UZzmBM8JymshhyLam6aWPoSYtjFp1P0LtwjsnQPZfZbRyQW07";
const X_RapidAPI_Host = "api-football-v1.p.rapidapi.com";

// returns list of current fixtures from api-football
app.get("/getFixtures", async (req, res) => {

    const test = true;

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
            url: `${url}/fixtures`,
            params: {date: date, timezone: "America/Toronto"},
            headers: {
                'X-RapidAPI-Key': X_RapidAPI_Key,
                'X-RapidAPI-Host': X_RapidAPI_Host,
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
// Currently, there is no API support for retreiving all available teams in every league
// This function makes a call to a specific league and season to retrieve the latest teams  
app.get("/getAllTeams", async (req, res) => {
    const retrieveTeamsFromSpecificLeague = false;
    const leagueID = 253;
    const season = 2022;

    if (retrieveTeamsFromSpecificLeague) {
        const options = {
            method: 'GET',
            url: `${url}/teams`,
            params: { league: leagueID, season: season },
            headers: {
                'X-RapidAPI-Key': X_RapidAPI_Key,
                'X-RapidAPI-Host': X_RapidAPI_Host,
                useQueryString: true
            }
        }
        let result = await axios.request(options);
        result = result.data.response;
        res.send(result);
    } else {
        res.send(allTeamsJSON);
    }
})

// returns list of all leagues from api-football
app.get("/getAllLeagues", (req, res) => {

    const test = true;

    if (test) {
        res.send(allLeaguesJSON);
    } else {
        const options = {
            method: 'GET',
            url: `${url}/leagues`,
            headers: {
                'X-RapidAPI-Key': X_RapidAPI_Key,
                'X-RapidAPI-Host': X_RapidAPI_Host,
                useQueryString: true
            }
        }
        axios.request(options).then(result => {
            res.send(result.data.response)
        })
    }
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
