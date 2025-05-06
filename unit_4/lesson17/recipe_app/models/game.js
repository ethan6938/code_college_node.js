const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
  },
  genre: {
    type: String,
  },
  developer: {
    type: String,
  },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
