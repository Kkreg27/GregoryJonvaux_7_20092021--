const fs = require("fs");
const con = require("../db");

exports.createMyInfo = (req, res, next) => {
  console.log(req);

  if (!req.file) {

    const profil = `INSERT INTO profil (idProfil,nom,prenom,age,poste) VALUES (${con.escape(
      req.body.idProfil
    )},${con.escape(
      req.body.nom
    )},${con.escape(req.body.prenom)},${con.escape(req.body.age)},${con.escape(
      req.body.poste
    )})`;

    con.query(profil, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Profil sans image créer" });
    });
    //Création de post avec image
  } else {
    if (req.file) {

      const json = req.body.data;
      const value = JSON.parse(json);
      const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`;

      const profil = `INSERT INTO profil (idProfil,nom,prenom,age,photo,poste) VALUES (${con.escape(
        req.body.idProfil
      )},${con.escape(
        value.nom
      )},${con.escape(value.prenom)},${con.escape(
        value.age
      )},"${imageUrl}",${con.escape(value.poste)})`;
      con.query(profil, function (err, result, fields) {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "Profil avec image crée" });
      });
    }
  }
};
exports.modifyMyInfo = (req, res, next) => {
  //Avec file
  if (req.file) {
    const lvl = JSON.parse(req.body.data);
    const admin = `select lvl from users where id = "${lvl.user}"`;
    //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
    con.query(admin, function (err, result, fields) {
      if (err) {
        throw err;
      }
      let obj = result.shift();
      let valeur = Object.values(obj);

      //Si celui ci à la valeur de l'administrateur alors il execute directement
      if (valeur[0] == 1) {
        const existImg = `select photo from profil where idProfil="${req.params.id}"`;
        con.query(existImg, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          if (valeur[0] == null) {
            const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename //creation de l'url de l'image
              }`;
            const json = req.body.data;
            const value = JSON.parse(json);
            const updt = `UPDATE profil
SET nom = "${value.nom}",prenom = "${value.prenom}",age = "${value.age}",photo = "${imageUrl}",poste = "${value.poste}"
WHERE idProfil = "${req.params.id}"`;
            con.query(updt, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res
                .status(200)
                .json({ message: "profil sans img maj avec img" });
            });
          } else {
            if (valeur[0] == !null) {
              const dltImg = `Select photo from profil where idProfil="${req.params.id}"`;
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
                const json = req.body.data;
                const value = JSON.parse(json);
                const updt = `UPDATE profil
SET nom = "${value.nom}",prenom = "${value.prenom}",age = "${value.age}",photo = "${imageUrl}",poste = "${value.poste}"
WHERE idProfil = "${req.params.id}"`;

                con.query(updt, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  return res.status(200).json({ message: "post modifié" });
                });
              });
            }
          }
        });
      }
      //Sinon on verifie si l'utilisateur concerné est bien le proprietaire du post
      else {
        if (valeur[0] == 0) {
          const auth = `select user from profil where idProfil ="${req.params.id}"`;
          con.query(auth, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);
            const json = req.body.data;
            const value = JSON.parse(json);
            if (valeur[0] !== value.user) {
              return res.status(400).json({ error: "utilisateur non valide" });
            }
            const existImg = `select photo from profil where idProfil="${req.params.id}"`;
            con.query(existImg, function (err, result, fields) {
              if (err) {
                throw err;
              }
              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] == null) {
                const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename //creation de l'url de l'image
                  }`;
                const json = req.body.data;
                const value = JSON.parse(json);
                const updt = `UPDATE profil
SET nom = "${value.nom}",prenom = "${value.prenom}",age = "${value.age}",photo = "${imageUrl}",poste = "${value.poste}"
WHERE idProfil = "${req.params.id}"`;
                con.query(updt, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  return res
                    .status(200)
                    .json({ message: "profil sans img maj avec img" });
                });
              } else {
                if (valeur[0] == !null) {
                  const dltImg = `Select photo from profil where idProfil="${req.params.id}"`;
                  con.query(dltImg, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    let obj = result.shift();
                    let valeur = Object.values(obj);

                    const filename = valeur[0].split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => { });

                    const imageUrl = `${req.protocol}://${req.get(
                      "host"
                    )}/images/${req.file.filename //creation de l'url de l'image
                      }`;
                    const json = req.body.data;
                    const value = JSON.parse(json);
                    const updt = `UPDATE profil
SET nom = "${value.nom}",prenom = "${value.prenom}",age = "${value.age}",photo = "${imageUrl}",poste = "${value.poste}"
WHERE idProfil = "${req.params.id}"`;

                    con.query(updt, function (err, result, fields) {
                      if (err) {
                        throw err;
                      }
                      return res.status(200).json({ message: "post modifié" });
                    });
                  });
                }
              }
            });
          });
        }
      }
    });
  } else {
    //Sans file
    if (!req.file) {
      const admin = `select lvl from users where id = "${req.body.user}"`;
      //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
      con.query(admin, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        //Si celui ci à la valeur de l'administrateur alors il execute directement
        if (valeur[0] == 1) {
          const updt = `UPDATE profil
SET nom = "${value.nom}",prenom = "${value.prenom}",age = "${value.age}",poste = "${value.poste}"
WHERE idProfil = "${req.params.id}"`;
          con.query(updt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "profil modifié" });
          });
        }
        //Sinon on verifie si l'utilisateur concerné est bien le proprietaire du profil
        else {
          if (valeur[0] == 0) {
            const auth = `select user from Profil where idProfil ="${req.params.id}"`;
            con.query(auth, function (err, result, fields) {
              if (err) {
                throw err;
              }

              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] !== req.body.user) {
                return res
                  .status(400)
                  .json({ error: "utilisateur non valide" });
              } else {
                if (valeur[0] == req.body.user) {
                  const updt = `UPDATE profil
SET nom = "${req.body.nom}",prenom = "${req.body.prenom}",age = "${req.body.age}",poste = "${req.body.poste}"
WHERE idProfil = "${req.params.id}"`;
                  con.query(updt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res.status(200).json({ message: "profil modifié" });
                  });
                }
              }
            });
          }
        }
      });
    }
  }
};
exports.deleteMyInfo = (req, res, next) => {
  //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
  const admin = `select lvl from users where id = "${req.body.user}"`;
  con.query(admin, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    //Si celui ci à la valeur de l'administrateur alors il execute directement la requete
    if (valeur[0] == 1) {
      //on verifie d'abord que le post avait une image .
      const verifImg = `Select photo from profil where idProfil = "${req.params.id}"`;
      con.query(verifImg, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        //si il n'y a aucune image alors on supprime directment
        if (valeur[0] == null) {
          const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
          con.query(dlt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "profil supprimé" });
          });
          // Sinon on supprime dabord l'image du serveur et ensuite on supprime le post de la database
        } else {
          const dltImg = `Select photo from profil where idProfil="${req.params.id}"`;
          con.query(dltImg, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);

            const filename = valeur[0].split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { });

            const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
            con.query(dlt, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res.status(200).json({ message: "profil supprimé" });
            });
          });
        }
      });
    }
    //Si celui ci n'a pas le niveau administrateur alors on verifie que ce soit la personne ayant créer le post qui veuille la supprimer
    else {
      if (valeur[0] == 0) {
        const auth = `select user from profil where idProfil="${req.params.id}"`;
        con.query(auth, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          const json = req.body.user;
          //si ce n'est pas le bon utilisateur on retourne une erreur
          if (valeur[0] !== json) {
            return res.status(400).json({ error: "requete impossible" });
          }
          //Sinon si c'est le bon utilisateur
          else {
            if (valeur[0] == json) {
              //on verifie d'abord que le post avait une image .
              const verifImg = `Select photo from profil where idProfil = "${req.params.id}"`;
              con.query(verifImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let obj = result.shift();
                let valeur = Object.values(obj);
                //si il n'y a aucune image alors on supprime directment
                if (valeur[0].length == 0) {
                  const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
                  con.query(dlt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res.status(200).json({ message: "profil supprimé" });
                  });
                  // Sinon on supprime dabord l'image du serveur et ensuite on supprime le post de la database
                } else {
                  const dltImg = `Select photo from profil where idProfil="${req.params.id}"`;
                  con.query(dltImg, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    let obj = result.shift();
                    let valeur = Object.values(obj);

                    const filename = valeur[0].split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => { });

                    const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
                    con.query(dlt, function (err, result, fields) {
                      if (err) {
                        throw err;
                      }
                      return res
                        .status(200)
                        .json({ message: "profil supprimé" });
                    });
                  });
                }
              });
            }
          }
        });
      }
    }
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
