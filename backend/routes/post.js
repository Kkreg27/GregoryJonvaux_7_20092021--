const express = require("express");
const router = express.Router();

const auth = require("../middleware/authToken"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const postCtrl = require("../controllers/post"); //Gestion de la logique de requetes

router.post("/publish", multer, postCtrl.createPost);
router.get("/all", postCtrl.getAllPost);
router.put("/:id", multer, postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);
router.put("/like/:id", postCtrl.likePost);
router.get("/like/:id", postCtrl.getAllLike);
router.post("/comment", multer, postCtrl.createComment);
router.delete("/comment/:id", postCtrl.deleteComment);
router.get("/comment/:id", postCtrl.getAllComment);

module.exports = router;
