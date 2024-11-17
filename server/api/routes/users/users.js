require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const sha256 = require("js-sha256");
const { readUsers } = require("../../../../fileHandler");

const userRoutes = Router();

userRoutes.post("/login", (req, res) => {
  const users = readUsers();

  const { password } = req.body;
  console.log("Password:", password);

  const hashedPassword = sha256(password);
  console.log("Hashed Password:", hashedPassword);

  const user = users.find((user) => user.password === hashedPassword);

  if (user) {
    const role = user.role;
    const token = jwt.sign({ role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  }

  return res.status(403).json({ error: "Invalid credentials" });
});

module.exports = userRoutes;
