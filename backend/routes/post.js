const express = require("express");
const router = express.Router();
const auth = require("../middleware/authToken"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const postCtrl = require("../controllers/post"); //Gestion de la logique de requetes
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post("/publish", auth, apiLimiter, multer, postCtrl.createPost);
router.get("/all", auth, postCtrl.getAllPost);
router.put("/:id", auth, apiLimiter, multer, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.put("/like/:id", auth, apiLimiter, postCtrl.likePost);
router.get("/like/:id", auth, postCtrl.getAllLike);
router.post("/comment/:id", auth, apiLimiter, multer, postCtrl.createComment);
router.delete("/comment/:id", auth, postCtrl.deleteComment);
router.get("/comment/:id", auth, postCtrl.getAllComment);

module.exports = router;
