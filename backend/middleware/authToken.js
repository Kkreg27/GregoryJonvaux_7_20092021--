const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization//.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token inexistant" })
    }
    jwt.verify(token, "RANDOM_TOKEN_SECRET", (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide" })
      }
      req.user = user

      next();
    });
  } catch {
    res.status(401).json({
      error: new Error("requete non valide!"),
    });
  }
};
