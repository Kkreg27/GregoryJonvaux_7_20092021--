const express = require("express");
const router = express.Router();

const auth = require("../middleware/authToken"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const profilCtrl = require("../controllers/profil"); //Gestion de la logique de requetes

router.post("/me/create", multer, profilCtrl.createMyInfo);
router.put("/me/:id", multer, profilCtrl.modifyMyInfo);
router.get("/me/:id", profilCtrl.getMyInfo);
router.get("/me/post/:id", profilCtrl.getMyPost);
router.delete("/me/:id", profilCtrl.deleteMyInfo);

module.exports = router;
