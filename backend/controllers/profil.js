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
  if (req.file) {

    const bodyParse = JSON.parse(req.body.data);

    const admin = `select lvl from users where id = "${bodyParse.idProfil}"`;
    con.query(admin, function (err, result, fields) {
      if (err) {
        throw err;
      }

      let obj = result.shift();
      let valeur = Object.values(obj);
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
      else {

        if (valeur[0] == 0) {

          const auth = `select idProfil from profil where idProfil ="${req.params.id}"`;
          con.query(auth, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);
            const json = req.body.data;
            const value = JSON.parse(json);

            if (valeur[0] !== value.idProfil) {
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
                if (valeur[0] != null) {
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
    if (!req.file) {
      const admin = `select lvl from users where id = "${req.body.idProfil}"`;
      con.query(admin, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
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
        else {
          if (valeur[0] == 0) {
            const auth = `select idProfil from Profil where idProfil ="${req.params.id}"`;
            con.query(auth, function (err, result, fields) {
              if (err) {
                throw err;
              }

              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] !== req.body.idProfil) {
                return res
                  .status(400)
                  .json({ error: "utilisateur non valide" });
              } else {
                if (valeur[0] == req.body.idProfil) {
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
  const admin = `select lvl from users where id = "${req.params.id}"`;
  con.query(admin, function (err, result, fields) {
    if (err) {
      throw err;
    }

    let obj = result.shift();

    let valeur = Object.values(obj);
    if (valeur[0] == 1) {
      const verifImg = `Select photo from profil where idProfil = "${req.params.id}"`;
      con.query(verifImg, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        if (valeur[0] == null) {
          const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
          con.query(dlt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "profil supprimé" });
          });
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
    else {
      if (valeur[0] == 0) {
        const auth = `select idProfil from profil where idProfil="${req.params.id}"`;
        con.query(auth, function (err, result, fields) {
          if (err) {
            throw err;
          }
          console.log(result.length);
          if (result.length == 0) {
            return res.status(400).json({ error: "requete impossible" });
          }
          else {
            if (result.length > 0) {
              const verifImg = `Select photo from profil where idProfil = "${req.params.id}"`;
              con.query(verifImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let obj = result.shift();
                let valeur = Object.values(obj);
                if (valeur[0].length == 0) {
                  const dlt = `DELETE FROM profil WHERE idProfil = "${req.params.id}"`;
                  con.query(dlt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res.status(200).json({ message: "profil supprimé" });
                  });
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
