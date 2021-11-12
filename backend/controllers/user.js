const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../db");
const validator = require("validator");
exports.signup = (req, res, next) => {
  ///////////Verifie si l'utilisateur existe////////////////
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
          const create = `INSERT INTO users (id,email,password,lvl) VALUES ("${obj[0]
            }",${con.escape(req.body.email)},"${hash}",0)`;
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
  const verif = `SELECT * FROM users`;//appel sql
  con.query(verif, function (err, result, fields) {
    if (err) throw err;//si une erreur alors err
    let billy = {} //declaration de variable pour recuperer le resultat de la boucle 

    function verification() {
      for (let elem of result)//de tous les elements de la requete on compare les emails
      {
        if (elem.email == req.body.email)//si l'un d'eux est égal alors on declare le resulats 
        {
          return elem // resultat
        } else {
          return false;
        }
      }
    }
    if (verification() == false) {
      return res.status(400).json({ error: "email invalide" })
    } else {

      return bcrypt.compare(req.body.password, verification().password).then((validity) => {
        if (!validity) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        } else {
          return res.status(200).json({
            message: "vous etes connecté",
            _id: verification().id,
            token: jwt.sign(
              { _id: verification().id }, //
              "RANDOM_TOKEN_SECRET", //
              { expiresIn: "1h" }
            ),
          });
        }
      });
    }
  });
};


