// The files in this directory contain functions that handle requests coming to different route

const {
  coinFlip,
  coinFlips,
  countFlips,
  flipACoin,
} = require("../utils/utilities");

const root = (req, res) => {
  res.status(200);
  res.json({ message: "API works (200)" });
};

const flip = (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json({ flip: coinFlip() });
};

const flips = (req, res) => {
  const flips = coinFlips(req.body.number);
  const count = countFlips(flips);
  res.status(200).json({ raw: flips, summary: count });
};

const call = (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json(flipACoin(req.body.call));
};

const flipNumber = (req, res) => {
  const flips = coinFlips(req.body.number);
  const count = countFlips(flips);
  res.status(200).json({ raw: flips, summary: count });
};

const callGuess = (req, res) => {
  const game = flipACoin(req.params.guess);
  res.status(200).json(game);
};

module.exports = { root, flip, flips, call, flipNumber, callGuess };
