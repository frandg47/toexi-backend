const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Rutas básicas
app.get("/", (req, res) => {
  res.json({ msg: "Backend funcionando 🚀" });
});

// Ejemplo: probar conexión con DB más adelante
const pool = require("./src/config/db");
app.get("/ping", async (req,res) => {
  const [rows] = await pool.query("SELECT NOW() AS now");
  res.json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
