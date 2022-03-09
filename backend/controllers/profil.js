const fs = require("fs");
const con = require("../db");

exports.createMyInfo = (req, res, next) => {
  if (!req.file) {

    let json = JSON.parse(req.body.data);
    const profil = `INSERT INTO profil (user,nom,prenom,age,poste) VALUES (${con.escape(
      json.user
    )},${con.escape(
      json.nom
    )},${con.escape(json.prenom)},${con.escape(json.age)},${con.escape(
      json.poste
    )})`;
    con.query(profil, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "profil sans photo crée" })

    });
  } else {
    if (req.file) {
      const json = req.body.data;
      const value = JSON.parse(json);
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`;
      const profil = `INSERT INTO profil (user,nom,prenom,age,photo,poste) VALUES (${con.escape(
        value.user
      )},${con.escape(
        value.nom
      )},${con.escape(value.prenom)},${con.escape(
        value.age
      )},"${imageUrl}",${con.escape(value.poste)})`;
      con.query(profil, function (err, result, fields) {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "profil avec photo crée" })

      });
    }
  }
};
exports.modifyMyInfo = (req, res, next) => {
  let obj = req.body
  let body = JSON.parse(obj.body);

  const verif = `select id from users where id = "${req.params.id}"`;
  //on verifie si l'id nous donne un resultat ou non 
  con.query(verif, function (err, result, fields) {
    if (err) {
      throw err;
    }
    if (result.length == 0) {
      return res.status(400).json({ message: "identifiant non valide" })
    } else {
      //function qui va permettre de créer la query sql en fonction des champs de saisie reçu
      function createSetString(body) {
        let string = 'SET '

        if (Object.keys(body).length == 0) {
          return string = 'SET '
        } else {
          for (let crit of Object.keys(body)) {
            string += `${crit} = "${body[crit]}"  ,`
          }

          if (!req.file) {
            string = string.slice(0, -2)
            return string
          } else {
            return string

          }
        }

      }
      //1ere option avec la modification d'un file 
      if (req.file) {
        //on verifie si il y a une image dans le profil
        const existImg = `select photo from profil where user="${req.params.id}"`;
        con.query(existImg, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          //il n'y avait pas d'image
          if (valeur[0] == null) {
            const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename //creation de l'url de l'image
              }`;

            const updt = `UPDATE profil ${createSetString(body)}
      photo = "${imageUrl}"
      WHERE user = "${req.params.id}"`;
            con.query(updt, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res
                .status(200)
                .json({ message: "profil mis a jour " });
            });
          }
          //il y avait une image
          else {

            const dltImg = `Select photo from profil where user ="${req.params.id}"`;
            con.query(dltImg, function (err, result, fields) {
              if (err) {
                throw err;
              }
              let obj = result.shift();
              let valeur = Object.values(obj);

              const filename = valeur[0].split("/images/")[1];
              fs.unlink(`images/${filename}`, () => { });

              const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename //creation de l'url de l'image
                }`;

              const updt = `UPDATE profil ${createSetString(body)}
      photo = "${imageUrl}"
      WHERE user = "${req.params.id}"`;

              con.query(updt, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                return res.status(200).json({ message: "profil modifié" });
              });
            });

          }
        });

      }
      //2eme option sans la modification d'un file 
      else {
        const updt = `UPDATE profil ${createSetString(body)}
      WHERE user = "${req.params.id}";`;
        con.query(updt, function (err, result, fields) {
          if (err) {
            throw err;
          }
          return res.status(200).json({ message: "profil modifié" });
        });
      }
    }
  })
};
exports.getMyInfo = (req, res, next) => {
  const info = `SELECT * FROM profil where user = "${req.params.id}"`;

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

exports.deleteAccount = (req, res, next) => {
  const existImg = `select photo from profil where user="${req.params.id}"`;
  con.query(existImg, function (err, result, fields) {
    if (err) {
      throw err;
    }
    console.log(result);
    let obj = result.shift();
    let valeur = Object.values(obj);
    //il n'y avait pas d'image
    if (valeur[0] == null) {
      const deleteAccount = `DELETE users,profil,post,comment FROM groupomania.users 
      LEFT JOIN profil on users.id= profil.user 
      LEFT JOIN post on profil.user=post.id_user 
      LEFT JOIN comment on post.id_user=comment.user_id
      where users.id = "${req.params.id}"; `
      con.query(deleteAccount, function (err, result, fields) {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "utilisateur supprimé" })
      })
    }
    //il y avait une image
    else {

      const dltImg = `Select photo from profil where user ="${req.params.id}"`;
      con.query(dltImg, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);

        const filename = valeur[0].split("/images/")[1];
        fs.unlink(`images/${filename}`, () => { });

        const deleteAccount = `DELETE users,profil,post,comment FROM groupomania.users 
        LEFT JOIN profil on users.id= profil.user 
        LEFT JOIN post on profil.user=post.id_user 
        LEFT JOIN comment on post.id_user=comment.user_id
        where users.id = "${req.params.id}"; `
        con.query(deleteAccount, function (err, result, fields) {
          if (err) {
            throw err;
          }
          return res.status(200).json({ message: "utilisateur supprimé" })
        })


      });

    }
  });

};


