const express = require("express");
const routes = require("./src/routes/someroutes");

const app = express();

const args = require("minimist")(process.argv.slice(2));
args[("port", "debug", "log", "help")];

const port = args.port || process.env.PORT || 5555;

const help = args.help;
const debug = args.debug || false;
const log = args.log || true;

const db = require("./src/services/database");

if (help === true) {
  console.log(`  
--port	    Set the port number for the server to listen on. Must be an integer
          between 1 and 65535.
--debug     If set to \`true\`, creates endlpoints /app/log/access/ which returns
          a JSON access log from the database and /app/error which throws 
          an error with the message "Error test successful." Defaults to 
         \`false\`.
--log       If set to false, no log files are written. Defaults to true.
          Logs are always written to database.
--help	  Return this message and exit.`);
  process.exit(0);
}

if (debug) {
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
}

const morgan = require("morgan");
const fs = require("fs");
if (log) {
  const accessLog = fs.createWriteStream("./log/access.log", {
    flags: "a",
  });
  app.use(morgan("combined", { stream: accessLog }));
}

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

const server = app.listen(port, () => {
  console.log("App listening on port %PORT%".replace("%PORT%", port));
});

exports.debug = debug;
