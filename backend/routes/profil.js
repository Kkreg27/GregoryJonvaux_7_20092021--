const express = require("express");
const router = express.Router();
const auth = require("../middleware/authToken"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const profilCtrl = require("../controllers/profil"); //Gestion de la logique de requetes
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // start blocking after 20 requests
});

router.post("/me/create", multer, profilCtrl.createMyInfo);
router.put("/me/:id", auth, apiLimiter, multer, profilCtrl.modifyMyInfo);
router.get("/me/:id", auth, profilCtrl.getMyInfo);
router.get("/me/post/:id", auth, profilCtrl.getMyPost);
router.delete("/me/:id", auth, profilCtrl.deleteMyInfo);

module.exports = router;
