const express = require("express");
const routes = require("./src/routes/someroutes");

const app = express();

const morgan = require("morgan");
const fs = require("fs");
const accessLog = fs.createWriteStream("./data/log/access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLog }));

app.use("/", routes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const args = require("minimist")(process.argv.slice(2));

const port = args.port || process.env.PORT || 5555;



const server = app.listen(port, () => {
  console.log("App listening on port %PORT%".replace("%PORT%", port));
});
