const express = require("express");
const path = require("path");
const flash = require("express-flash");
const cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();

app.use(cors());

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "script")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1, key2"],
    maxAge: 1000 * 60 * 60 * 24,
  })
);

app.use(flash());

let indexRoute = require("./routes/index");

let codeSettingRoute = require("./routes/code_master");
let patliteSettingRoute = require("./routes/patlite_master");

let dropdownRoute = require("./routes/dropdown");
let patliteRoute = require("./routes/patlite");

app.use("/", indexRoute);

app.use("/code_master", codeSettingRoute);
app.use("/patlite_master", patliteSettingRoute);

app.use("/dropdown", dropdownRoute);
app.use("/patlite", patliteRoute);

module.exports = app;
