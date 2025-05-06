const Game = require("../models/game");

exports.getAllGames = (req, res) => {
  Game.find({})
    .exec()
    .then((games) => {
      res.render("game", { games: games });
    })
    .catch((error) => {
      console.log(error.message);
      res.send("Error fetching games.");
    });
};

exports.getGameCreationPage = (req, res) => {
  res.render("addGame"); // Render the game creation form
};

exports.saveGame = (req, res) => {
  const newGame = new Game({
    title: req.body.title,
    genre: req.body.genre,
    platform: req.body.platform.split(","), // Splitting the comma-separated string into an array
    description: req.body.description,
    releaseYear: req.body.releaseYear,
    zipCode: req.body.zipCode,
  });

  newGame.save()
    .then(() => res.redirect("/game")) // Redirect to the game list after saving
    .catch((error) => res.send(error.message));
};
