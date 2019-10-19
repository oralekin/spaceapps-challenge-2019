const mongoose = require("mongoose")
const satellite = require("satellite.js");

const debrisSchema = new mongoose.Schema({

  id: {
    type: Number,
    max: 99999,
  },

  name: {
    type: String,
    length: 24,
  },

  TLEs: {
    type: [String],
    length: 2,
  },

  exists: {
    type: Boolean,
    default: true
  }
});

debrisSchema.statics.addByTLE = function(/** @param {String[]} TLEs */ TLEs) {
  const satrec = satellite.twoline2satrec(TLEs[1], TLEs[2])
  this.create({
    name: TLEs[0],
    id: parseInt(TLEs[1].slice(2,7)),
    TLEs: TLEs,
  })
};

debrisSchema.methods.asResponseString = function() {
  const d = new Date();
  const newLocal = satellite.propagate(satellite.twoline2satrec(this.TLEs[1], this.TLEs[2]), d);
  let {x, y, z} = newLocal.position;
  
  // scale according to the game
  x = x/300;
  y = y/300;
  z = z/300;

  return ([
    this.id, this.name, x, y, z
  ].join(";"))
};

debrisSchema.methods.setEaten = function() {
  this.exists = false;
}

module.exports = mongoose.model("Debris", debrisSchema);