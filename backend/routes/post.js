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

router.post("/publish", auth, multer, postCtrl.createPost);
router.put("/:id", auth, multer, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);
router.get("/all", auth, postCtrl.getAllPost);
router.post("/comment/:id", apiLimiter, auth, multer, postCtrl.createComment);
router.get("/comment/:id", auth, postCtrl.getAllComment);

module.exports = router;
