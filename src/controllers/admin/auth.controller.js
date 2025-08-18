const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [[admin]] = await pool.query(
      "SELECT id, email, password_hash FROM admins WHERE email = ?",
      [email]
    );
    if (!admin) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true en producción con HTTPS
      maxAge: 8 * 60 * 60 * 1000
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Error en login" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
};

module.exports = { login, logout };
