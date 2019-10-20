const express = require("express");
const app = express();
var http = require('http').createServer(app);

const mongoose = require("mongoose");
const Debris = require("./schema/Debris.mongoose");
const Player = require("./schema/Player.mongoose");
const parseGetQuery = require("./geturlparser")

app.use(express.static("app"));

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
      console.log(q.id)
      console.log(doc)
      doc.setEaten();
      res.sendStatus(200);
    }
  })
})

reports.get("/pos", (req, res) => {
//   const q = parseGetQuery(req.url);
//   Player.findById(q.id).then((doc) => {
//     console.log(doc);
//     if(doc == null) {
//       res.sendStatus(500);
//     } else {
//       doc.xLocationAngle = q.x;
//       doc.yLocationAngle = q.y;
//       doc.zLocationAngle = q.z;
//       doc.height = q.height;
//       doc.lastUpdate = new Date();
      res.sendStatus(200);
//     }
//   })
});


reports.get("/start", (req, res) => {
  Player.create({lastUpdate: new Date()}, (err, doc) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.status(200).send(doc._id.valueOf());
    }
  })
});



// #endregion

// #region requests for info from the server
const infoReqs = express.Router();

infoReqs.get("/sats", function (req, res) {
  Debris
    .find({exists: true})
    .sort("_id asc")
    .limit(50)
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
        console.log("responded with satellites")
      }
    });
})

infoReqs.get("/players", function (req, res) {
  Player.find((err, docs) => {
    ret = "";
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      console.log(doc)
      console.log(doc.lastUpdate.getTime())
      console.log(Date.now());

      if (doc.lastUpdate.getTime() < Date.now() - 1000) {
        console.log("purged player");
        doc.remove();
      } else {
        ret+=doc.asResponseString()+"\n";
      }
    }
    res.status(200).send(ret);
  })
})

// #endregion


app.use("/report", reports);
app.use("/req", infoReqs);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
