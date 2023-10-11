const FavTeams = require("../schemaModels/favTeamsModel");
const FavLeagues = require("../schemaModels/favLeaguesModel"); 
const mongoose = require("mongoose");

require('dotenv').config();

try {
	mongoose.connect(
		process.env.MONGODB_CONNECTION,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		() => console.log("Connected to MongoDB.")
	);
} catch (err) {
	console.log("Failed to connect to MongoDB.", err)
}

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

module.exports = { getFavTeams, getFavLeagues, getFavTeamsMatches, getAllOtherLeaguesMatches, getCurrentDate };