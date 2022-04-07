// The files in this directory contain functions that handle requests coming to different routes
const db = require("../services/database");

const {
  coinFlip,
  coinFlips,
  countFlips,
  flipACoin,
} = require("../utils/utilities");

const root = (req, res, next) => {
  res.status(200);
  res.json({ message: "API works (200)" });
};

const log = (req, res, next) => {
  try {
    const stmt = db.prepare("SELECT * FROM accesslog").all();
    res.status(200).json(stmt);
  } catch (e) {
    console.error(e);
  }
};

const error = (req, res, next) => {
  res.status(500);
  res.end("Error test works.");
};

const flip = (req, res, next) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json({ flip: coinFlip() });
};

const flips = (req, res, next) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  var arr = coinFlips(req.body.number);
  res.json({ raw: arr, summary: countFlips(arr) });
};

const call = (req, res, next) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json(flipACoin(req.body.call));
};

module.exports = { root, log, error, flip, flips, call };
