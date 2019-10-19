const express = require("express");
const app = express();
var http = require('http').createServer(app);

const mongoose = require("mongoose");
const Debris = require("./schema/Debris.mongoose");
const Player = require("./schema/Player.mongoose");
const parseGetQuery = require("./geturlparser")


mongoose.connect("mongodb://localhost/mission", (err) => {
  if (err) {
    console.log("cannot connect to mongo instance")
    console.log(err);
  }
})

// #region info incoming from player
const reports = express.Router();

reports.get("/eat", (req, res) => {
  const q = parseGetQuery(req.url);
  Debris.findOne({id: q.id}, (err, doc) => {
    if (err) {
      res.sendStatus(500);
    } else {
      doc.setEaten();
      res.sendStatus(200);
    }
  })
})


// #endregion

// #region requests for info from the server
const infoReqs = express.Router();

infoReqs.get("/sats", function (req, res) {
  Debris
    .find({exists: true})
    .sort("_id asc")
    .limit(200)
    .exec((err, docs) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        let ret = "";
        docs.forEach((doc) => {
          // console.log(doc);
          ret+=doc.asResponseString();
          ret+="\n";
        })
        res.status(200).send(ret);
      }
    });
})

infoReqs.get("/players", function (req, res) {
  Player
    .find()
    .exec((err, docs) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        let ret = "";
        docs.forEach((doc) => {
          // console.log(doc);
          ret+=doc.asResponseString();
          ret+="\n";
        })
        res.status(200).send(ret);
      }
    })
})

infoReqs.get("/factions", function (req, res) {

})

// #endregion


app.use("/report", reports);
app.use("/req", infoReqs);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
