const { coinFlip, coinFlips, countFlips, flipACoin } = require('./src/utils/utilities')

const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
const fs = require("fs");

const db = require("./src/services/database");

const args = require("minimist")(process.argv.slice(2));
args[("port", "debug", "log", "help")];

const port = args.port || process.env.PORT || 5555;


// Use morgan for logging to files
// Create a write stream to append to an access.log file
const accessLog = fs.createWriteStream("./data/log/access.log", {
flags: "a",
});
// Set up the access logging middleware
app.use(morgan("combined", { stream: accessLog }));


const server = app.listen(port, () => {
  console.log("App listening on port %PORT%".replace("%PORT%", port));
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/app", (req, res) => {
  res.status(200);
  res.json({ message: "API works (200)" });
});

app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    secure: req.secure,
    status: res.statusCode,
    referer: req.headers["referer"],
    useragent: req.headers["user-agent"],
  };
  const stmt =
    db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, 
    protocol, httpversion, secure, status, referer, useragent) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  const info = stmt.run(
    String(logdata.remoteaddr),
    String(logdata.remoteuser),
    String(logdata.time),
    String(logdata.method),
    String(logdata.url),
    String(logdata.protocol),
    String(logdata.httpversion),
    String(logdata.secure),
    String(logdata.status),
    String(logdata.referer),
    String(logdata.useragent)
  );
  next();
});

app.get("/app/log/access/", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM accesslog").all();
    res.status(200).json(stmt);
  } catch (e) {
    console.error(e);
  }
});
app.get("/app/error/", (req, res) => {
  res.status(500);
  res.end("Error test works.");
});

// Coin flip APIs
app.get("/app/flip", (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json({ flip: coinFlip() });
});

app.get("/app/flip/coins/", (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  var arr = coinFlips(req.body.number);
  res.json({ raw: arr, summary: countFlips(arr) });
});

app.get("/app/flip/call/", (req, res) => {
  res.statusCode = 200;
  res.statusMessage = "OK";
  res.type("text/json");
  res.json(flipACoin(req.body.call));
});

app.use(function (req, res) {
  res.status(404);
  res.json({ message: "Endpoint not found (404)" });
});
