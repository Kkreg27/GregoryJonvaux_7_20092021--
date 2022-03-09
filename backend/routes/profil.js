const express = require("express");
const router = express.Router();
const auth = require("../middleware/authToken");
const multer = require("../middleware/multer-config");
const profilCtrl = require("../controllers/profil");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.post("/me/create", auth, multer, profilCtrl.createMyInfo);
router.put("/me/:id", auth, multer, profilCtrl.modifyMyInfo);
router.get("/me/:id", auth, profilCtrl.getMyInfo);
router.get("/me/post/:id", auth, profilCtrl.getMyPost);
router.delete("/me/:id", auth, profilCtrl.deleteAccount)
module.exports = router;
