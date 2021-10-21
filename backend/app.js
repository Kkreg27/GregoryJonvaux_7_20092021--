const express = require("express");
var mysql = require("mysql");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const profilRoutes = require("./routes/profil");
const postRoutes = require("./routes/post");
var mysql = require("mysql");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//-------Middleware génrérale qui ajoute des headers au réponse pour les autorisation de CORS------------------------
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "groupomania",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/profil/", profilRoutes);
app.use("/api/post/", postRoutes);
app.use("/api/auth/", userRoutes);

module.exports = app;
