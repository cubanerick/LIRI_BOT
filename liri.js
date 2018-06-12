require("dotenv").config();

// ***** Global Variables Section *****
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var parameter = process.argv[3];

var newcommand = "";
var songname = "";
var movietitle = "";
var argument = "";

// ****** Client and spotify variables grabs access keys from .env file *****
var client = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});

// ****** Functions Section *****
function log(value){
    fs.appendFile("log.txt", value, function(error){  
       if(error){
           console.log(error);
       }else{
        console.log("Added to Log File");
       }
    });
}

function getmytweets() {
    var params = {};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log("Error occured: " + error)
        } else {
            console.log(tweets);
            log(tweets);
        }

    });
}

function spotifythissong() {
    var songname = "";
    for (var i = 3; i < process.argv.length; i++) {
        songname += process.argv[i] + " ";
    }

    
    if(songname === ""){
        spotify.search({type: "track", query: "The Sign"}, function(error,data) {
            if (error) {
                return console.log("Error occurred: " + error);
            }else {
                console.log("Artists: " + data.tracks.items[7].artists[0].name);
                console.log('Album Name: ' + data.tracks.items[7].album.name);
                console.log("Song name: " + data.tracks.items[7].name);
                console.log("Link: " + data.tracks.items[7].preview_url);
                log("Artists: " + data.tracks.items[7].artists[0].name);
                log('Album Name: ' + data.tracks.items[7].album.name);
                log("Song name: " + data.tracks.items[7].name);
                log("Link: " + data.tracks.items[7].preview_url);
            }
        });
    }else {
        spotify.search({ type: "track", query: songname, limit: "1"}, function(error, data) {
            if (error) {
                return console.log("Error occurred: " + error);
            }else {
                console.log("Artists: " + data.tracks.items[0].artists[0].name);
                console.log("Album Name: " + data.tracks.items[0].album.name);
                console.log("Song name: " + data.tracks.items[0].name);
                console.log("Link: " + data.tracks.items[0].preview_url);
                log("Artists: " + data.tracks.items[0].artists[0].name);
                log("Album Name: " + data.tracks.items[0].album.name);
                log("Song name: " + data.tracks.items[0].name);
                log("Link: " + data.tracks.items[0].preview_url);
            }
        });
    }
}

function getmovieinfo() {
    var movietitle = "";
    for (var i = 3; i < process.argv.length; i++) {
        movietitle += process.argv[i] + " ";
    }
    
    request("http://www.omdbapi.com/?apikey=trilogy&s=" + movietitle , function (error, response, body) {
        if(error){
            console.log(error);
        }else {
            
            var results = JSON.parse(body);
           
            request("http://www.omdbapi.com/?apikey=trilogy&i=" + results.Search[0].imdbID , function (error, response, body) {
                if(error){
                    console.log(error)
                }else {
                    var results = JSON.parse(body)
                    console.log("Title: " + results.Title);
                    console.log("Release Year: " + results.Year);
                    console.log("IMDB Rating: " + results.Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
                    console.log("Produced in: " + results.Country);
                    console.log("Language: " + results.Language);
                    console.log("Plot: " + results.Plot);
                    console.log("Actors: " + results.Actors);
                    log("Title: " + results.Title);
                    log("Release Year: " + results.Year);
                    log("IMDB Rating: " + results.Ratings[0].Value);
                    log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
                    log("Produced in: " + results.Country);
                    log("Language: " + results.Language);
                    log("Plot: " + results.Plot);
                    log("Actors: " + results.Actors);
                }
            })
        }
    });
}

function getcommandtxt(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }else{
            //console.log(data);
            var dataArr = data.split(",");
            // We will then re-display the content as an array for later use.
            //console.log(dataArr);
            newcommand = dataArr[0];
            //console.log(command)
            argument = dataArr[1].replace(/['"]+/g, '');
            //console.log(argument)

            switch(newcommand){
                case "my-tweets":
                    getmytweets();
                break;

                case "spotify-this-song":
                    songname = argument;
                    spotify.search({ type: "track", query: songname, limit: "1"}, function(error, data) {
                        if (error) {
                            return console.log("Error occurred: " + error);
                        }else {
                            console.log("Artist: " + data.tracks.items[0].artists[0].name);
                            console.log("Album Name: " + data.tracks.items[0].album.name);
                            console.log("Song name: " + data.tracks.items[0].name);
                            console.log("Link: " + data.tracks.items[0].preview_url);
                            log("Artist: " + data.tracks.items[0].artists[0].name);
                            log("Album Name: " + data.tracks.items[0].album.name);
                            log("Song name: " + data.tracks.items[0].name);
                            log("Link: " + data.tracks.items[0].preview_url);
                        }
                    });
                break;

                case "movie-this":
                request("http://www.omdbapi.com/?apikey=trilogy&s=" + argument , function (error, response, body) {
                    if(error){
                        console.log(error);
                    }else {
                        
                        var results = JSON.parse(body);
                       
                        request("http://www.omdbapi.com/?apikey=trilogy&i=" + results.Search[0].imdbID , function (error, response, body) {
                            if(error){
                                console.log(error)
                            }else {
                                var results = JSON.parse(body)
                                console.log("Title: " + results.Title);
                                console.log("Release Year: " + results.Year);
                                console.log("IMDB Rating: " + results.Ratings[0].Value);
                                console.log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
                                console.log("Produced in: " + results.Country);
                                console.log("Language: " + results.Language);
                                console.log("Plot: " + results.Plot);
                                console.log("Actors: " + results.Actors);
                                log("Title: " + results.Title);
                                log("Release Year: " + results.Year);
                                log("IMDB Rating: " + results.Ratings[0].Value);
                                log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
                                log("Produced in: " + results.Country);
                                log("Language: " + results.Language);
                                log("Plot: " + results.Plot);
                                log("Actors: " + results.Actors);
                            }
                        })
                    }
                });
                break;
            }
        }
    });
}

//***** Main Conditionals Section*******
switch(command){
    case "my-tweets":
       getmytweets();
    break;

    case "spotify-this-song":
        spotifythissong();
    break;

    case "movie-this":
        getmovieinfo();
    break;

    case "do-what-it-says":
        getcommandtxt();
    break;
}