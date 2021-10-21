const fs = require("fs");
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "groupomania",
});

exports.createMyInfo = (req, res, next) => {
  const uuid = `SELECT UUID()`;
  const json = req.body.data;
  const value = JSON.parse(json);

  con.query(uuid, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    const profil = `INSERT INTO profil (idprofil,nom,prenom,age,photo,poste) VALUES ("${
      valeur[0]
    }",${con.escape(value.nom)},${con.escape(value.prenom)},${con.escape(
      value.age
    )},"${imageUrl}",${con.escape(value.poste)})`;

    con.query(profil, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: " profil crée" });
    });
  });
};
exports.modifyMyInfo = (req, res, next) => {
  const dltImg = `Select photo from profil where idprofil="${req.params.id}"`;
  con.query(dltImg, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    console.log(valeur);

    const filename = valeur[0].split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {});

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
    const json = req.body.data;
    const value = JSON.parse(json);
    const updtProfil = `UPDATE profil
SET nom = "${value.nom}",prenom ="${value.prenom}",age ="${value.age}",photo ="${imageUrl}",poste ="${value.poste}"
WHERE idprofil = "${req.params.id}"`;

    con.query(updtProfil, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "post modifié" });
    });
  });
};
exports.deleteMyInfo = (req, res, next) => {
  const dltImg = `Select photo from profil where idprofil="${req.params.id}"`;
  con.query(dltImg, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    console.log(valeur);

    const filename = valeur[0].split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {});

    const dlt = `DELETE FROM profil WHERE idprofil = "${req.params.id}"`;
    con.query(dlt, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "profil supprimé" });
    });
  });
};
exports.getMyInfo = (req, res, next) => {
  const info = `SELECT * FROM profil where idprofil = "${req.params.id}"`;

  con.query(info, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
exports.getMyPost = (req, res, next) => {
  const myPost = `SELECT * FROM post where id_user = "${req.params.id}"`;

  con.query(myPost, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
