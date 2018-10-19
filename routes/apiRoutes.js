var db = require("../models");
var moment = require("moment");
var keys = require("../keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Example.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });
  app.post("/band/image", function(req,res) {
    band = req.body
    console.log(band)
    spotify.search({ type: 'artist', query: req.body.bandname, limit: 1 }, function (err, data) {
      if (err) {
          return console.log('Error occurred: ' + err);
      }
      var artistPic = data.artists.items[0].images[1].url
    // (band) => {
    //   var queryURL = "http://api.giphy.com/v1/gifs/search?q=jamaican+resteraunt&total_count=1&images&tag&api_key=dc6zaTOxFJmzC";
    //      $.get(queryURL).then(
    //          function(response) {
    //            Img = new Image();
    //            Img.src = response.data[0].images.fixed_height.url
    //            $(".bandimg").html(Img)
    //          }
    //        );
    res.json(artistPic)
    })
  })
  app.post("/band/date", function(req, res) {
    console.log(`now here`)
    console.log(req.body['[]'])
    const formattedDates = [];
    const formattedTimes = [];
    const endDates = [];
    const startDates = [];
    // // console.log(req)
    req.body['[]'].forEach(index => {
      formattedDates.push(moment(index).format('MMMM Do YYYY'));
      formattedTimes.push(moment(index).format('h:mm:ss a'));
      endDates.push(moment(index).utc().add(1, 'M').format());
      startDates.push(moment(index).utc().subtract(1, 'M').format());
    });

    // console.log(req.body)
    // console.log(req)
    // date = moment(req).format("L")
    res.json({
      dates: formattedDates,
      times: formattedTimes,
      sdates: startDates,
      edates: endDates
    }
      );
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
