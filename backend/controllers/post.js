const fs = require("fs");
const con = require("../db");

exports.createPost = (req, res, next) => {
  if (!req.file) {
    let value = JSON.parse(req.body.description)
    const post = `INSERT INTO post (id_user,description) VALUES (${con.escape(
      value.user
    )},${con.escape(value.description)})`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Post sans image crée" });
    });
    //Création de post avec image
  } else {

    const json = req.body.description;
    const value = JSON.parse(json);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`;

    const post = `INSERT INTO post (id_user,description,image) VALUES (${con.escape(
      value.user
    )},${con.escape(value.description)},"${imageUrl}")`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Post avec image crée" });
    });
  }
};
exports.modifyPost = (req, res, next) => {
  if (req.file) {
    const value = JSON.parse(req.body.description);
    const admin = `select lvl from users where id = "${value.id_user}"`;
    con.query(admin, function (err, result, fields) {
      if (err) {
        throw err;
      }
      let obj = result.shift();
      let valeur = Object.values(obj);
      if (valeur[0] == 1) {
        const existImg = `select image from post where idPost="${req.params.id}"`;
        con.query(existImg, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          if (valeur[0] == null) {
            const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
              }`;
            const value = JSON.parse(req.body.description);
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
                fs.unlink(`images/${filename}`, () => { });

                const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
                  }`;
                const value = JSON.parse(req.body.description);

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
      else {
        if (valeur[0] == 0) {
          const auth = `select id_user from post where idPost="${req.params.id}"`;
          con.query(auth, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);
            const value = JSON.parse(req.body.description);


            if (valeur[0] !== value.id_user) {
              return res.status(400).json({ error: "utilisateur non valide" });
            } else {


              const existImg = `SELECT image FROM groupomania.post WHERE idPost="${req.params.id}"`
              con.query(existImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let x = result.shift()
                let valeur = Object.values(x);


                if (valeur[0] == null) {
                  const value = JSON.parse(req.body.description);

                  const imageUrl = `${req.protocol}://${req.get(
                    "host"
                  )}/images/${req.file.filename
                    }`;

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
                  if (valeur[0] !== null) {

                    const dltImg = `Select image from post where idPost="${req.params.id}"`;
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
                      )}/images/${req.file.filename
                        }`;
                      const value = JSON.parse(req.body.description);

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
  }
  else {
    if (!req.file) {
      let value = JSON.parse(req.body.description)
      const admin = `select lvl from users where id = "${value.id_user}"`;
      con.query(admin, function (err, result, fields) {
        if (err) {
          throw err;
        }

        let obj = result.shift();
        let valeur = Object.values(obj);

        if (valeur[0] == 1) {
          const updt = `UPDATE post
  SET description = "${value.description}"
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
        else {
          if (valeur[0] == 0) {
            const auth = `select id_user from post where idPost="${req.params.id}"`;
            con.query(auth, function (err, result, fields) {
              if (err) {
                throw err;
              }

              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] !== value.id_user) {
                return res
                  .status(400)
                  .json({ error: "utilisateur non valide" });
              } else {
                if (valeur[0] == value.id_user) {
                  const updt = `UPDATE post
  SET description = "${value.description}"
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
  const admin = `select lvl from users where id = "${req.body.id_user}"`;
  con.query(admin, function (err, result, fields) {
    if (err) {
      throw err;
    }
    let obj = result.shift();
    let valeur = Object.values(obj);
    if (valeur[0] == 1) {
      const verifImg = `Select image from post where idPost = "${req.params.id}"`;
      con.query(verifImg, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        if (valeur[0] == null) {
          const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
          con.query(dlt, function (err, result, fields) {
            if (err) {
              throw err;
            }
            return res.status(200).json({ message: "post supprimé" });
          });
        } else {
          const dltImg = `Select image from post where idPost="${req.params.id}"`;
          con.query(dltImg, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);

            const filename = valeur[0].split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { });

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
      const auth = `select id_user from post where idPost="${req.params.id}"`;
      con.query(auth, function (err, result, fields) {
        if (err) {
          throw err;
        }
        let obj = result.shift();
        let valeur = Object.values(obj);
        const json = req.body.id_user;
        if (valeur[0] !== json) {
          return res.status(400).json({ error: "requete impossible" });
        }
        else {
          if (valeur[0] == json) {
            const verifImg = `Select image from post where idPost = "${req.params.id}"`;
            con.query(verifImg, function (err, result, fields) {
              if (err) {
                throw err;
              }
              let obj = result.shift();
              let valeur = Object.values(obj);
              if (valeur[0] == null) {
                const dlt = `DELETE FROM post WHERE idPost = "${req.params.id}"`;
                con.query(dlt, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  return res.status(200).json({ message: "post supprimé" });
                });
              } else {
                const dltImg = `Select image from post where idPost="${req.params.id}"`;
                con.query(dltImg, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  let obj = result.shift();
                  let valeur = Object.values(obj);

                  const filename = valeur[0].split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => { });

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
exports.getAllPost = (req, res, next) => {
  const post = "SELECT post.idPost, post.description, post.image, profil.nom, profil.prenom,profil.photo FROM groupomania.post inner join profil on post.id_user = profil.user ORDER BY idPost desc;"

  con.query(post, function (err, result, fields) {
    if (err) {
      throw err;
    }
    return res.status(200).json({ message: result })
  });
};
exports.createComment = (req, res, next) => {
  const json = req.body;
  const com = `INSERT INTO comment (texte,post_id,user_id) VALUES (${con.escape(
    json.value
  )},${con.escape(req.params.id)},${con.escape(json.user)})`;

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
    if (valeur[0] == 1) {
      const dltComment = `DELETE FROM comment WHERE idComment = "${req.params.id}"`;
      con.query(dltComment, function (err, result, fields) {
        if (err) {
          throw err;
        }
        return res.status(200).json({ message: "comment supprimé" });
      });
    } else {
      if (valeur[0] == 0) {
        const auth = `select user_id from comment where idComment="${req.params.id}"`;
        con.query(auth, function (err, result, fields) {
          if (err) {
            throw err;
          }
          let obj = result.shift();
          let valeur = Object.values(obj);
          const json = req.body.id;
          if (valeur[0] != json) {
            return res.status(400).json({ error: "requete impossible" });
          }
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
  const comment = `SELECT comment.idComment,comment.texte,profil.nom,profil.prenom,profil.photo FROM comment INNER JOIN profil on profil.user=comment.user_id WHERE post_id = "${req.params.id}"`;

  con.query(comment, function (err, result, fields) {
    if (err) {
      throw err;
    }

    return res.status(200).json({ message: result });
  });
};
