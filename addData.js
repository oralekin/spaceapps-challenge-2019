const mongoose = require("mongoose");
const Debris = require("./schema/Debris.mongoose");
const jsonlist = require("./TLE_filtered.json");

mongoose.connect("mongodb://localhost/mission", (err) => {
  if (err) {
    console.log("cannot connect to mongo instance")
    console.error(err);
  }
})


jsonlist.forEach((satInfo) => {
  Debris.addByTLE([
    satInfo.OBJECT_NAME,
    satInfo.TLE_LINE1,
    satInfo.TLE_LINE2
  ]);
  console.log("added " + satInfo.OBJECT_NAME);
})
