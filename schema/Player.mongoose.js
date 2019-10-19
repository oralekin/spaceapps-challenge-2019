const mongoose = require("mongoose");
const satellite = require("satellite.js");

const playerSchema = new mongoose.Schema({
  id: Number,  
  name:String,  
  faction: String,
  
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
  }
});


playerSchema.methods.asResponseString = function() {
 
  return ([
    this.id, this.name, this.faction, this.xLocationAngle, this.yLocationAngle, this.zLocationAngle, this.height
  ].join(";"))
};


module.exports = mongoose.model("Player", playerSchema);