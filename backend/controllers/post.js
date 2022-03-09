const fs = require("fs");
const con = require("../db");

exports.createPost = (req, res, next) => {

  if (!req.file) {
    let value = req.body
    const post = `INSERT INTO post (id_user,description) VALUES (${con.escape(
      value.id_user
    )},${con.escape(value.description)})`;

    con.query(post, function (err, result, fields) {
      if (err) {
        throw err;
      }
      return res.status(200).json({ message: "Post sans image crée" });
    });
    //Création de post avec image
  } else {

    const value = req.body

    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename
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
exports.modifyPost = (req, res, next) => {
  if (req.file) {
    const value = req.body

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
            const value = req.body



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
                  const value = req.body
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
                      const value = req.body


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
      let value = req.body
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

      //on verifie les commentaires
      let com = `Select post_id from comment where user_id = "${req.params.id}"`;
      con.query(com, function (err, result, fields) {
        if (err) {
          throw err;
        }
        if (result.length == 0) {
          //si il ny a pas de com alors on supprime limage et le post 
          const verifImg = `Select image from post where idPost = "${req.body.id_user}"`;
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
              const dltImg = `Select image from post where idPost="${req.body.id_user}"`;
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
          const verifImg = `Select image from post where idPost = "${req.body.id_user}"`;
          con.query(verifImg, function (err, result, fields) {
            if (err) {
              throw err;
            }
            let obj = result.shift();
            let valeur = Object.values(obj);
            if (valeur[0] == null) {

              let coms = `DELETE post, comment FROM  post INNER JOIN comment ON post.idPost=comment.post_id  
          WHERE post.idPost=${req.body.id_user};`
              con.query(coms, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                return res.status(200).json({ message: "post supprimé" });
              })
            } else {
              const dltImg = `Select image from post where idPost="${req.body.id_user}"`;
              con.query(dltImg, function (err, result, fields) {
                if (err) {
                  throw err;
                }
                let obj = result.shift();
                let valeur = Object.values(obj);

                const filename = valeur[0].split("/images/")[1];
                fs.unlink(`images/${filename}`, () => { });


                let coms = `DELETE post, comment FROM  post INNER JOIN comment ON post.idPost=comment.post_id  
          WHERE post.idPost=${req.body.id_user};`
                con.query(coms, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  return res.status(200).json({ message: "post supprimé" });
                })
              });
            }
          });
        }
      })
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
            //on verifie les commenaires
            let com = `Select post_id from comment where post_id = "${req.body.id_user}"`;
            con.query(com, function (err, result, fields) {
              if (err) {
                throw err;
              }
              if (result.length == 0) {
                //si il ny a pas de com alors on supprime limage et le post 
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
                const verifImg = `Select image from post where idPost = "${req.body.id_user}"`;
                con.query(verifImg, function (err, result, fields) {
                  if (err) {
                    throw err;
                  }
                  let obj = result.shift();
                  let valeur = Object.values(obj);
                  if (valeur[0] == null) {

                    let coms = `DELETE post, comment FROM  post INNER JOIN comment ON post.idPost=comment.post_id  
          WHERE post.idPost=${req.body.id_user};`
                    con.query(coms, function (err, result, fields) {
                      if (err) {
                        throw err;
                      }
                      return res.status(200).json({ message: "post supprimé" });
                    })
                  } else {
                    const dltImg = `Select image from post where idPost="${req.body.id_user}"`;
                    con.query(dltImg, function (err, result, fields) {
                      if (err) {
                        throw err;
                      }
                      let obj = result.shift();
                      let valeur = Object.values(obj);

                      const filename = valeur[0].split("/images/")[1];
                      fs.unlink(`images/${filename}`, () => { });


                      let coms = `DELETE post, comment FROM  post INNER JOIN comment ON post.idPost=comment.post_id  
          WHERE post.idPost=${req.body.id};`
                      con.query(coms, function (err, result, fields) {
                        if (err) {
                          throw err;
                        }
                        return res.status(200).json({ message: "post supprimé" });
                      })
                    });
                  }
                });
              }
            })
          }
        }
      });
    }
  });
};
exports.getAllPost = (req, res, next) => {
  const post = "SELECT post.idPost, post.description, post.image, profil.nom, profil.prenom,profil.photo,profil.user FROM groupomania.post inner join profil on post.id_user = profil.user ORDER BY idPost desc;"

  con.query(post, function (err, result, fields) {
    if (err) {
      throw err;
    }
    return res.status(200).json({ message: result })
  });
};
exports.createComment = (req, res, next) => {
  const value = req.body;
  const com = `INSERT INTO comment (texte,post_id,user_id) VALUES (${con.escape(
    value.value
  )},${con.escape(req.params.id)},${con.escape(value.user)})`;

  con.query(com, function (err, result, fields) {
    if (err) {
      throw err;
    }
    return res.status(200).json({ message: "commentaire créé" });
  });
};
exports.getAllComment = (req, res, next) => {
  const comment = `SELECT comment.idComment,comment.texte,profil.nom,profil.prenom,profil.photo FROM comment INNER JOIN profil on profil.user=comment.user_id WHERE post_id = "${req.params.id}"`;

  con.query(comment, function (err, result, fields) {
    if (err) {
      throw err;
    }
    console.log(result);
    return res.status(200).json({ message: result });
  });
};
