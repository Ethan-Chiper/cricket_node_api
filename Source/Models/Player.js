const Connection = require('../App/Connection');
const playerConnection = Connection.getPlayerDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const playerSchema = new playerConnection.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  team: { type: String, required: true }
});
playerSchema.plugin(timestamps);

let playerModel = mongoose.model('Player', playerSchema);

module.exports = playerModel;
