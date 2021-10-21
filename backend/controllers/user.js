var mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "groupomania",
});
exports.signup = (req, res, next) => {
  ///////////Verifie si l'utilisateur existe////////////////

  const verif = `SELECT * FROM users`;

  con.query(verif, function (err, result, fields) {
    if (err) throw err;
    const email = req.body.email;
    for (let elem of result) {
      if (email === elem.email) {
        return res.status(400).json({ error: "adresse deja existante" });
      }
    }
    const uuid = `SELECT UUID()`;

    con.query(uuid, function (err, result, fields) {
      if (err) throw err;
      for (let elem of result) {
        const obj = Object.values(elem);

        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) return res.status(400).json({ err });
          const create = `INSERT INTO users (id,email,password) VALUES ("${
            obj[0]
          }",${con.escape(req.body.email)},"${hash}")`;
          con.query(create, function (error, results, fields) {
            if (error) {
              throw error;
            }
            return res.status(200).json({ message: "utilisateur créer" });
          });
        });
      }
    });

    //////////Créer un utilisateur///////////////////////////
  });
};

exports.login = (req, res, next) => {
  const verif = `SELECT * FROM users`;
  con.query(verif, function (err, result, fields) {
    if (err) throw err;
    const email = req.body.email;

    for (let elem of result) {
      if (email === elem.email) {
        const user = elem;
        console.log(user.id);
        bcrypt.compare(req.body.password, elem.password).then((validity) => {
          if (!validity) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          res.status(200).json({
            _id: user.id,
            token: jwt.sign(
              { _id: user.id }, //
              "RANDOM_TOKEN_SECRET", //
              { expiresIn: "24h" }
            ),
          });
        });
      }
    }
  });
};
