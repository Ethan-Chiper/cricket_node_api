const Connection = require('../App/Connection');
const teamConnection = Connection.getTeamDBConnection();
const timestamps = require('mongoose-timestamp');
const mongoose = require('mongoose');

const teamSchema = new teamConnection.Schema({
  team_id:{type: String},
  teamName: { type: String, required: true },
  players: [{ type: String, required: true }],
  captain: { type: String, required: true },
  viceCaptain: { type: String, required: true },
  points: { type: Number, default: 0 }
});
teamSchema.plugin(timestamps);

let teamModel = mongoose.model('Team', teamSchema);

module.exports = teamModel;