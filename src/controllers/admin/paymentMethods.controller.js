const pool = require("../../config/db");

const list = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, multiplier FROM payment_methods ORDER BY id`
    );
    res.json(rows);
  } catch (e) {
    console.error("pm.list error:", e);
    res.status(500).json({ error: "Error al listar métodos de pago" });
  }
};

const create = async (req, res) => {
  try {
    const { name, multiplier } = req.body;
    const [r] = await pool.query(
      `INSERT INTO payment_methods (name, multiplier) VALUES (?, ?)`,
      [name, multiplier]
    );
    req.io?.emit("products.updated");
    res.json({ id: r.insertId });
  } catch (e) {
    console.error("pm.create error:", e);
    res.status(500).json({ error: "Error al crear método de pago" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, multiplier } = req.body;
    await pool.query(
      `UPDATE payment_methods SET name = ?, multiplier = ? WHERE id = ?`,
      [name, multiplier, id]
    );
    req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("pm.update error:", e);
    res.status(500).json({ error: "Error al actualizar método de pago" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM payment_methods WHERE id = ?`, [id]);
    req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("pm.remove error:", e);
    res.status(500).json({ error: "Error al eliminar método de pago" });
  }
};

module.exports = { list, create, update, remove };
