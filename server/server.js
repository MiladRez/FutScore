const axios = require("axios");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const FavTeams = require("./schemaModels/favTeamsModel");
const FavLeagues = require("./schemaModels/favLeaguesModel");
const cors = require("cors");

const {
	getFavTeams,
	getFavLeagues,
	getFavTeamsMatches,
	getAllOtherLeaguesMatches,
	getCurrentDate
} = require("./utils/consolidateDataHelperFuncs.js");

const todaysMatches = require("./jsonFiles/todaysMatches.json");
const allTeamsJSON = require("./jsonFiles/allTeams.json");
const allLeaguesJSON = require("./jsonFiles/allLeagues.json");

const PORT = process.env.PORT || 8080;

require('dotenv').config();

mongoose.connect(
	process.env.MONGODB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
	console.log("Connected to MongoDB.");
}).catch(err => {
	console.log("Failed to connect to MongoDB.", err)
});
    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

// returns list of current fixtures from api-football
app.get("/getFixtures", async (req, res) => {

	const test = true;
	let data;

	if (test) {
		data = todaysMatches.data
    } else {
        let date = getCurrentDate();

        const options = {
            method: 'GET',
            url: `${process.env.API_FOOTBALL_URL}/fixtures`,
            params: {date: date, timezone: "America/Toronto"},
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
                useQueryString: true
            }
        };
        
        const result = await axios.request(options);
        data = result.data.response;
	}

	const matchesLimit = 200;

	const favTeams = await getFavTeams(data);
	const favLeagues = await getFavLeagues(data);
	const favTeamsMatches = await getFavTeamsMatches(favTeams);
	const allOtherLeagues = await getAllOtherLeaguesMatches(data, favLeagues, matchesLimit);
	res.send({ "data": data, "favTeams": favTeams, "favLeagues": favLeagues, "favTeamsMatches": favTeamsMatches, "allOtherLeagues": allOtherLeagues });
})

// Would have to run this every new season to get the latest teams in each league
// Currently, there is no API support for retreiving all available teams in every league
// This function makes a call to a specific league and season to retrieve the latest teams  
app.get("/getAllTeams", async (req, res) => {
    const retrieveTeamsFromSpecificLeague = false;
    const leagueID = 253;
    const season = 2023;

    if (retrieveTeamsFromSpecificLeague) {
        const options = {
            method: 'GET',
            url: `${process.env.API_FOOTBALL_URL}/teams`,
            params: { league: leagueID, season: season },
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
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
            url: `${process.env.API_FOOTBALL_URL}/leagues`,
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
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

app.get("/removeTeam/:team_id", (req, res) => {
	var team_id = req.params.team_id;
	FavTeams.deleteOne({team_id: team_id}, (err) => {
		if (err) {
			console.log("Failed to remove team from database.")
			return err
		}
		console.log("Removed team from favourites.", team_id)
	})
})

app.post("/addLeague", (req, res) => {
	console.log("I am hit")
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

app.get("/removeLeague/:league_id", (req, res) => {
	var league_id = req.params.league_id;
	FavLeagues.deleteOne({id: league_id}, (err) => {
		if (err) {
			console.log("Failed to remove league from database.")
			return err
		}
		console.log("Removed league from favourites.", league_id)
	})
})

// Port is currently pointing to 3000 for local testing
app.listen(PORT, process.env.IP, function () {
    console.log("The FutScore server has started!");
});
