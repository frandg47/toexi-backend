const pool = require("../../config/db");

const setActiveFx = async (req, res) => {
  try {
    const { rate, source } = req.body;
    await pool.query(`UPDATE fx_rates SET is_active = 0`);
    await pool.query(
      `INSERT INTO fx_rates (rate, source, is_active) VALUES (?, ?, 1)`,
      [rate, source || null]
    );
    req.io?.emit("fx.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("fx.setActiveFx error:", e);
    res.status(500).json({ error: "Error al actualizar cotización" });
  }
};

module.exports = { setActiveFx };
