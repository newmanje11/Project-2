var db = require("../models");
var moment = require("moment");

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
  
  app.post("/band/date", function(req, res) {
    console.log(`now here`)
    console.log(req)
    // const formattedDates = moment(req).format("L");
    // // console.log(req)
    // // req.forEach(index => {
    // //   formattedDates.push(moment(index).format("L"));
    // // });
    // console.log(req.body)
    console.log(req)
    date = moment(req).format("L")
    res.json(date);
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
