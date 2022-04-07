// Middleware function definitions go here

const morgan = require("morgan");
const fs = require("fs");
// Use morgan for logging to files
// Create a write stream to append to an access.log file
// Set up the access logging middleware
const logging = (req, res, next) => {
  // Use morgan for logging to files
  // Create a write stream to append to an access.log file
  const accessLog = fs.createWriteStream("./data/log/access.log", { flags: "a" });
  // Set up the access logging middleware
  morgan("combined", { stream: accessLog });
  next();
};

const db = require("../services/database");

const database = (req, res, next) => {
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
};

const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: "Endpoint not found (404)" });
  next();
};

module.exports = { logging, database, notFound };
