const mongoose = require("mongoose");
const satellite = require("satellite.js");

const playerSchema = new mongoose.Schema({
  xLocationAngle:{
    type: Number,
    default: 0
  },
  
  yLocationAngle:{
    type: Number,
    default: -10
  },
  
  zLocationAngle:{
    type: Number,
    default: 0
  },
  
  height:{
    type: Number,
    default: 21
  },

  lastUpdate: {
    type: Date
  }
});



playerSchema.methods.asResponseString = function() {
  return ([
    this.id, this.xLocationAngle, this.yLocationAngle, this.zLocationAngle, this.height
  ].join(";"));
};

playerSchema.statics.getAndKillOld = function() {
  ret = "";
  this.find((err, docs) => {
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
  })
  return ret;
}


module.exports = mongoose.model("Player", playerSchema);