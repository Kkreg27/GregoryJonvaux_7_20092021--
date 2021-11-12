const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Trop de tentative de requete, Merci de réessayer plus tard ",
});

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
