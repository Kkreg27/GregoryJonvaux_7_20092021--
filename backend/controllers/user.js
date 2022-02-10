const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../db");
const validator = require("validator");



exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Email ou mot de passe manquant" });
  }
  if (
    !validator.isEmail(req.body.email) &&
    !validator.isStrongPassword(req.body.password)
  ) {
    return res.status(400).json({ error: "Email ou mot de passe non valide" });
  }
  const verif = `SELECT * FROM users`;
  con.query(verif, function (err, result, fields) {
    if (err) throw err;
    const email = req.body.email;
    for (let elem of result) {
      if (email == elem.email) {
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
          const create = `INSERT INTO users (id,email,password,lvl) VALUES ("${obj[0]
            }",${con.escape(req.body.email)},"${hash}",0)`;
          con.query(create, function (error, results, fields) {
            if (error) {
              throw error;
            }
            return res.status(200).json({
              message: "utilisateur crée",
              _id: obj[0],
              token: jwt.sign(
                { _id: obj[0] },
                "RANDOM_TOKEN_SECRET",
                { expiresIn: "1h" }
              ),
            });
          });
        });
      }
    });

  });
};

exports.login = (req, res, next) => {
  const verif = `SELECT * FROM users  WHERE email= "${req.body.email}"`;
  con.query(verif, function (err, result, fields) {
    if (err) throw err;
    if (result.length == 0) {
      return res.status(401).json({ message: "email invalide" })
    } else {
      const profil = `SELECT * FROM users INNER JOIN groupomania.profil ON users.id = profil.user WHERE email= "${req.body.email}"`;
      let value = result
      con.query(profil, function (err, result, fields) {
        if (err) throw err;
        if (result.length == 0) {
          return bcrypt.compare(req.body.password, value[0].password).then((validity) => {
            if (!validity) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            } else {
              return res.status(200).json({
                message: "vous etes connecté",
                profil: 0,
                _id: value[0].id,
                token: jwt.sign(
                  { _id: value[0].id },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "1h" }
                ),
              });
            }
          });
        }
        else {

          return bcrypt.compare(req.body.password, value[0].password).then((validity) => {
            if (!validity) {
              return res.status(401).json({ error: "Mot de passe incorrect !" });
            } else {
              return res.status(200).json({
                message: "vous etes connecté",
                profil: 1,
                _id: value[0].id,
                token: jwt.sign(
                  { _id: value[0].id },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "1h" }
                ),
              });
            }
          });
        }

      });






    }

  });
};


