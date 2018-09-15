var request = require("request"),
    express = require("express"),
    bodyParser = require("body-parser"),
    app = express();
    
app.set("view engine", "ejs");
app.use(express.static("public"));

// request("http://livescore-api.com/api-client/scores/live.json?key=fyZ6Y0JVL0azKSnb&secret=qMKEBfegENcJK0U0yU7wVRsGRCfCuCOV", function(error, response, body){
//     if (!error && response.statusCode == 200) {
//         var parsedData = JSON.parse(body);
//         parsedData["data"]["match"].forEach(fixture => {
//             if (fixture.league_name == "K-League 1"){
//                 console.log(fixture.score, fixture.league_name);
//             }
//         });
//     } else {
//         console.log("ERROR");
//     }
// });
var fav_leagues = ["LaLiga Santander", "Ligue 1", "Bundesliga"];

app.get("/", function(req, res){
    request("http://livescore-api.com/api-client/scores/live.json?key=fyZ6Y0JVL0azKSnb&secret=qMKEBfegENcJK0U0yU7wVRsGRCfCuCOV", function(error, response, body){
        if (!error && response.statusCode == 200) {
            var parsedData = JSON.parse(body);
            res.render("index", {body: parsedData, leagues: fav_leagues});
        } else {
            console.log("ERROR");
        }
    });
});

app.get("/favouriteleagues", function(req, res) {
    res.render("favouriteleagues");
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("The FutScore server has started!");
});

