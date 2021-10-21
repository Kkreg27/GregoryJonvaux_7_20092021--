const fs = require("fs");
var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root",
  database: "groupomania",
});

exports.createPost = (req, res, next) => {
  console.log(req);
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
      req.file.filename //creation de l'url de l'image
    }`;

    const post = `INSERT INTO post (_id,id_user,description,image) VALUES ("${
      valeur[0]
    }",${con.escape(value.id_user)},${con.escape(
      value.description
    )},"${imageUrl}")`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "crée" });
    });
  });
};
exports.getAllPost = (req, res, next) => {
  const post = "SELECT * FROM post";

  con.query(post, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
exports.modifyPost = (req, res, next) => {
  const dltImg = `Select image from post where _id="${req.params.id}"`;
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
      req.file.filename //creation de l'url de l'image
    }`;
    const json = req.body.data;
    const value = JSON.parse(json);
    const updt = `UPDATE post
SET description = "${value.description}",image ="${imageUrl}"
WHERE _id = "${req.params.id}"`;

    con.query(updt, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "post modifié" });
    });
  });
};
exports.deletePost = (req, res, next) => {
  const dltImg = `Select image from post where _id="${req.params.id}"`;
  con.query(dltImg, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    console.log(valeur);

    const filename = valeur[0].split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {});

    const dlt = `DELETE FROM post WHERE _id = "${req.params.id}"`;
    con.query(dlt, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "post supprimé" });
    });
  });
};
exports.likePost = (req, res, next) => {
  //On identifie en premier l'etat du like
  let identify = `SELECT IsLike FROM likedislike where Post_id = "${req.params.id}"`;
  con.query(identify, function (err, result, fields) {
    if (err) {
      throw err;
    }
    //On identifie si un like existe

    if (result.length == 0) {
      if (req.body.like == 0) {
        return res.status(400).json({ message: "nothing" });
      } else {
        if (req.body.like == 1) {
          const uuid = `SELECT UUID()`;
          con.query(uuid, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);

            const postLike = `INSERT INTO likedislike (idLikeDislike,User_id,Post_id,IsLike) VALUES ("${
              valeur[0]
            }",${con.escape(req.body.User_id)},${con.escape(
              req.body.Post_id
            )},${con.escape(req.body.like)})`;

            con.query(postLike, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res.status(200).json({ message: "Like inséré" });
            });
          });
        }
      }
    } else {
      //Si on trouve un resultat alors
      const resultat = result[0].IsLike;
      //si resultat est le même alors nothing
      if (req.body.like == resultat) {
        return res.status(400).json({
          erreur: "Requete non accepté car requete et état actuel sont egaux",
        });
        //sinon
      } else {
        //si le resultat = 1 && req 0 alors on DELETE
        if (resultat == 1 && req.body.like == 0) {
          const dlt = `DELETE FROM likedislike WHERE Post_id = "${req.params.id}"`;
          con.query(dlt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "like supprimé" });
          });
        } else {
          //Un like existe deja donc on l'UPDATE
          if (resultat == 0 && req.body.like == 1) {
            const updtLike = `UPDATE likedislike
SET IsLike = "${req.body.like}"
WHERE Post_id = "${req.params.id}"`;

            con.query(updtLike, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res.status(200).json({ message: "Like effectué" });
            });
          }
        }
      }
    }
  });
};
exports.getAllLike = (req, res, next) => {
  const like = `SELECT count(IsLike) FROM likedislike where Post_id = "${req.params.id}" and IsLike = 1`;

  con.query(like, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
exports.createComment = (req, res, next) => {
  const json = req.body;
  const uuid = `SELECT UUID()`;

  con.query(uuid, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);

    const com = `INSERT INTO comment (idcomment,texte,post_id,user_id) VALUES ("${
      valeur[0]
    }",${con.escape(json.texte)},${con.escape(json.post_id)},${con.escape(
      json.user_id
    )})`;

    con.query(com, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "commentaire créé" });
    });
  });
};
exports.deleteComment = (req, res, next) => {
  const dltComment = `DELETE FROM comment WHERE idcomment = "${req.params.id}"`;
  con.query(dltComment, function (err, result, fields) {
    if (err) {
      throw err;
    }
    return res.status(200).json({ message: "comment supprimé" });
  });
};
exports.getAllComment = (req, res, next) => {
  const comment = `SELECT texte,image FROM comment where post_id = "${req.params.id}"`;

  con.query(comment, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
