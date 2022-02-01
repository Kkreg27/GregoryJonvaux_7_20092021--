var mysql = require("mysql");
require("dotenv").config();

const db_user = process.env.db_user;
const db_password = process.env.db_password;
const database = process.env.database;

var con = mysql.createConnection({
  host: "localhost",
  user: db_user,
  password: db_password,
  database: database,
});

con.connect(function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log("Database connecté!");
})

module.exports = con;
