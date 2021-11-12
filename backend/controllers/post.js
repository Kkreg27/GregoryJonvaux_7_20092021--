const fs = require("fs");
const con = require("../db");

exports.createPost = (req, res, next) => {
  //Création d'un post sans image
  if (!req.file) {
    const post = `INSERT INTO post (id_user,description) VALUES (${con.escape(
      req.body.id_user
    )},${con.escape(req.body.description)})`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Post sans image crée" });
    });
    //Création de post avec image
  } else {
    const json = req.body.data;
    const value = JSON.parse(json);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    const post = `INSERT INTO post (id_user,description,image) VALUES (${con.escape(
      value.id_user
    )},${con.escape(value.description)},"${imageUrl}")`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Post avec image crée" });
    });
  }
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
  //Avec file
  if (req.file) {
    const lvl = JSON.parse(req.body.data);
    const admin = `select lvl from users where id = "${lvl.id_user}"`;
    //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
    con.query(admin, function (err, result, fields) {
      if (err) {
        throw err;
      }
      let obj = result.shift();
      let valeur = Object.values(obj);
      //Si celui ci à la valeur de l'administrateur alors il execute directement
      if (valeur[0] == 1) {
        //on verifie si le post contenait deja une image
        const existImg = `select image from post where idPost="${req.params.id}"`;
        con.query(existImg, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          if (valeur[0] == null) {
            const imageUrl = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename //creation de l'url de l'image
            }`;
            const json = req.body.data;
            const value = JSON.parse(json);
            const updt = `UPDATE post
SET description = "${value.description}",image="${imageUrl}"
WHERE idPost = "${req.params.id}"`;
            con.query(updt, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res
                .status(200)
                .json({ message: "post sans img maj avec img" });
            });
          } else {
            if (valeur[0] == !null) {
              const dltImg = `Select image from post where idPost="${req.params.id}"`;
              con.query(dltImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let obj = result.shift();
                let valeur = Object.values(obj);

                const filename = valeur[0].split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {});

                const imageUrl = `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename //creation de l'url de l'image
                }`;
                const json = req.body.data;
                const value = JSON.parse(json);
                const updt = `UPDATE post
SET description = "${value.description}",image ="${imageUrl}"
WHERE idPost = "${req.params.id}"`;

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
          const auth = `select id_user from post where idPost="${req.params.id}"`;
          con.query(auth, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);
            const json = req.body.data;
            const value = JSON.parse(json);
            if (valeur[0] !== value.id_user) {
              return res.status(400).json({ error: "utilisateur non valide" });
            } else {
              //on verifie si le post contenait deja une image
              con.query(existImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let obj = result.shift();
                let valeur = Object.values(obj);
                if (valeur[0] == null) {
                  const json = req.body.data;
                  const value = JSON.parse(json);
                  const updt = `UPDATE post
SET description = "${value.description}"
WHERE idPost = "${req.params.id}"`;
                  con.query(updt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res
                      .status(200)
                      .json({ message: "post sans img maj avec img" });
                  });
                } else {
                  if (valeur[0] == !null) {
                    const dltImg = `Select image from post where idPost="${req.params.id}"`;
                    con.query(dltImg, function (err, result, fields) {
                      if (err) {
                        throw err;
                      }
                      let obj = result.shift();
                      let valeur = Object.values(obj);

                      const filename = valeur[0].split("/images/")[1];
                      fs.unlink(`images/${filename}`, () => {});

                      const imageUrl = `${req.protocol}://${req.get(
                        "host"
                      )}/images/${
                        req.file.filename //creation de l'url de l'image
                      }`;
                      const json = req.body.data;
                      const value = JSON.parse(json);
                      const updt = `UPDATE post
SET description = "${value.description}",image ="${imageUrl}"
WHERE idPost = "${req.params.id}"`;

                      con.query(updt, function (err, result, fields) {
                        if (err) {
                          throw err;
                        }
                        return res
                          .status(200)
                          .json({ message: "post modifié" });
                      });
                    });
                  }
                }
              });
            }
          });
        }
      }
    });
  } //Sans file
  else {
    if (!req.file) {
      const admin = `select lvl from users where id = "${req.body.id_user}"`;
      //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
      con.query(admin, function (err, result, fields) {
        if (err) {
          throw err;
        }

        let obj = result.shift();
        let valeur = Object.values(obj);

        //Si celui ci à la valeur de l'administrateur alors il execute directement
        if (valeur[0] == 1) {
          const updt = `UPDATE post
SET description = "${req.body.description}"
WHERE idPost = "${req.params.id}"`;
          con.query(updt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({
              message: "post modifié par administrateur sans nouvelle image",
            });
          });
        }
        //Sinon on verifie si l'utilisateur concerné est bien le proprietaire du post
        else {
          if (valeur[0] == 0) {
            const auth = `select id_user from post where idPost="${req.params.id}"`;
            con.query(auth, function (err, result, fields) {
              if (err) {
                throw err;
              }

              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] !== req.body.id_user) {
                return res
                  .status(400)
                  .json({ error: "utilisateur non valide" });
              } else {
                if (valeur[0] == req.body.id_user) {
                  const updt = `UPDATE post
SET description = "${req.body.description}"
WHERE idPost = "${req.params.id}"`;
                  con.query(updt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res.status(200).json({
                      message:
                        "post modifié par le bon user sans modification d'image",
                    });
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
exports.deletePost = (req, res, next) => {
  //Premiere étape on verifie le niveau d'acreditation de l'envoyeur
  const admin = `select lvl from users where id = "${req.body.id_user}"`;
  con.query(admin, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    //Si celui ci à la valeur de l'administrateur alors il execute directement la requete
    if (valeur[0] == 1) {
      //on verifie d'abord que le post avait une image .
      const verifImg = `Select image from post where idPost = "${req.params.id}"`;
      con.query(verifImg, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        //si il n'y a aucune image alors on supprime directment
        if (valeur[0] == null) {
          const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
          con.query(dlt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "post supprimé" });
          });
          // Sinon on supprime dabord l'image du serveur et ensuite on supprime le post de la database
        } else {
          const dltImg = `Select image from post where idPost="${req.params.id}"`;
          con.query(dltImg, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);

            const filename = valeur[0].split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {});

            const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
            con.query(dlt, function (err, result, fields) {
              if (err) {
                throw err;
              }
              return res.status(200).json({ message: "post supprimé" });
            });
          });
        }
      });
    } else {
      //Si celui ci n'a pas le niveau administrateur alors on verifie que ce soit la personne ayant créer le post qui veuille la supprimer
      const auth = `select id_user from post where idPost="${req.params.id}"`;
      con.query(auth, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        const json = req.body.id_user;
        //si ce n'est pas le bon utilisateur on retourne une erreur
        if (valeur[0] !== json) {
          return res.status(400).json({ error: "requete impossible" });
        }
        //Sinon si c'est le bon utilisateur
        else {
          if (valeur[0] == json) {
            //on verifie d'abord que le post avait une image .
            const verifImg = `Select image from post where idPost = "${req.params.id}"`;
            con.query(verifImg, function (err, result, fields) {
              if (err) {
                throw err;
              }
              let obj = result.shift();
              let valeur = Object.values(obj);
              //si il n'y a aucune image alors on supprime directment
              if (valeur[0] == null) {
                const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
                con.query(dlt, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  return res.status(200).json({ message: "post supprimé" });
                });
                // Sinon on supprime dabord l'image du serveur et ensuite on supprime le post de la database
              } else {
                const dltImg = `Select image from post where idPost="${req.params.id}"`;
                con.query(dltImg, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  let obj = result.shift();
                  let valeur = Object.values(obj);

                  const filename = valeur[0].split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {});

                  const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
                  con.query(dlt, function (err, result, fields) {
                    if (err) {
                      throw err;
                    }
                    return res.status(200).json({ message: "post supprimé" });
                  });
                });
              }
            });
          }
        }
      });
    }
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
          const postLike = `INSERT INTO likedislike (User_id,Post_id,IsLike) VALUES (${con.escape(
            req.body.User_id
          )},${con.escape(req.params.id)},${con.escape(req.body.like)})`;

          con.query(postLike, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "Like inséré" });
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
  const com = `INSERT INTO comment (texte,post_id,user_id) VALUES (${con.escape(
    json.texte
  )},${con.escape(req.params.id)},${con.escape(json.user_id)})`;

  con.query(com, function (err, result, fields) {
    if (err) {
      throw err;
    }
    return res.status(200).json({ message: "commentaire créé" });
  });
};
exports.deleteComment = (req, res, next) => {
  const admin = `select lvl from users where id = "${req.body.id}"`;
  con.query(admin, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    //Si celui ci à la valeur de l'administrateur alors il execute directement la requete
    if (valeur[0] == 1) {
      //on verifie d'abord que le  avait une image .
      const dltComment = `DELETE FROM comment WHERE idComment = "${req.params.id}"`;
      con.query(dltComment, function (err, result, fields) {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "comment supprimé" });
      });
    } else {
      //Si celui ci n'a pas le niveau administrateur alors on verifie que ce soit la personne ayant créer le post qui veuille la supprimer
      if (valeur[0] == 0) {
        const auth = `select user_id from comment where idComment="${req.params.id}"`;
        con.query(auth, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          const json = req.body.id;
          //si ce n'est pas le bon utilisateur on retourne une erreur
          if (valeur[0] !== json) {
            return res.status(400).json({ error: "requete impossible" });
          }
          //Sinon si c'est le bon utilisateur
          else {
            if (valeur[0] == json) {
              const dltComment = `DELETE FROM comment WHERE idComment = "${req.params.id}"`;
              con.query(dltComment, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                return res.status(200).json({ message: "comment supprimé" });
              });
            }
          }
        });
      }
    }
  });
};
exports.getAllComment = (req, res, next) => {
  const comment = `SELECT texte FROM comment where post_id = "${req.params.id}"`;

  con.query(comment, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
