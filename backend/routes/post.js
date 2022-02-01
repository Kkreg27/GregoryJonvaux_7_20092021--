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

router.post("/publish", multer, postCtrl.createPost);
router.put("/:id", multer, postCtrl.modifyPost);
router.delete("/:id", postCtrl.deletePost);
router.get("/all", postCtrl.getAllPost);
router.post("/comment/:id", multer, postCtrl.createComment);
router.delete("/comment/:id", postCtrl.deleteComment);
router.get("/comment/:id", postCtrl.getAllComment);

module.exports = router;
