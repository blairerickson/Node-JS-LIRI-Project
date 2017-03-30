/**
 * Created by blair on 3/24/17.
 */

// Include the request npm package
var request = require('request');
var fs = require('fs');
var dataArr = ["",""];

// Grabs the keys for APIs
var keys = require("./keys.js");

// Gets all of twitter keys from the file.
var TwitKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;

// uses the "twit" node package
var Twit = require('twit');

var T = new Twit({
    consumer_key:         TwitKeys.consumer_key,
    consumer_secret:      TwitKeys.consumer_secret,
    access_token:         TwitKeys.access_token_key,
    access_token_secret:  TwitKeys.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


var spotify = require('spotify');


// grab command from terminal
var command = process.argv[2];

// grab query data from terminal
var query = "";

// grabs all the words after the initial command and compiles them into the query
for (var i = 3; i < process.argv.length; i++) {
    query = query + "+" + process.argv[i];
}

//master function calling all sub commands of LIRI
function liri()
{

// trigger Twitter API if my-tweets command issued
    if (command == "my-tweets") {

        // calls the twit package to get last 20 tweets

        var options = {
            screen_name: 'blairerickson',
            count: 20
        };

        T.get('statuses/user_timeline', options, function (err, data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].text);
                console.log(data[i].created_at);
            }
        })

    }
    ;

// calls the spotify API library
    if (command == "spotify-this-song") {
        if (query == "") {
            query = "The+Sign+Ace+of+Base";
        }

        spotify.search({type: 'track', query: query}, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            else {
                console.log("Spotify Info:");
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].album.name);
                console.log(data.tracks.items[0].album.external_urls);


            }
        });
    }
    ;

// Run a request to the OMDB API with the movie specified
    if (command == "movie-this") {

// Run request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&r=json";


        request(queryUrl, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                // Parse the body of the site and recover just the imdbRating
                // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
                console.log("TITLE: " + JSON.parse(body).Title);
                console.log("PLOT: " + JSON.parse(body).Plot);
                console.log("The movie was released in: " + JSON.parse(body).Year);
                console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
                console.log("Made in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("RottenTomatoes score: " + JSON.parse(body).Ratings[1].Value);

            }
        });


    }

};

if (command == "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {

        // Then split it by commas (to make it more readable)
       dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

    });

  command = dataArr[0];
  query = dataArr[1];
    liri();
}


liri();

console.log(dataArr[0]);