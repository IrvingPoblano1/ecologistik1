const express = require("express");
const router  = express.Router();

/* POST /api/auth/login */
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@ecologistik.com" && password === "12345678") {
    return res.json({ token: "mock-token", user: { email, role: "admin" } });
  }
  res.status(401).json({ message: "Credenciales incorrectas" });
});

module.exports = router;

