const pool = require("../../config/db");

const list = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT cr.*, b.name AS brand, c.name AS category
       FROM commission_rules cr
       LEFT JOIN brands b ON b.id = cr.brand_id
       LEFT JOIN categories c ON c.id = cr.category_id
       ORDER BY priority ASC, category_id, brand_id`
    );
    res.json(rows);
  } catch (e) {
    console.error("cr.list error:", e);
    res.status(500).json({ error: "Error al listar reglas de comisión" });
  }
};

const create = async (req, res) => {
  try {
    const { category_id = null, brand_id = null, commission_pct = null, commission_fixed = null, priority = 100 } = req.body;
    const [r] = await pool.query(
      `INSERT INTO commission_rules
       (category_id, brand_id, commission_pct, commission_fixed, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [category_id, brand_id, commission_pct, commission_fixed, priority]
    );
    // req.io?.emit("products.updated");
    res.json({ id: r.insertId });
  } catch (e) {
    console.error("cr.create error:", e);
    res.status(500).json({ error: "Error al crear regla de comisión" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ["category_id","brand_id","commission_pct","commission_fixed","priority"];
    const data = fields.reduce((acc,f)=>{ if (f in req.body) acc[f]=req.body[f]; return acc; },{});
    if (!Object.keys(data).length) return res.status(400).json({ error: "Nada para actualizar" });

    const set = Object.keys(data).map(k => `${k} = ?`).join(", ");
    await pool.query(`UPDATE commission_rules SET ${set} WHERE id = ?`, [...Object.values(data), id]);
    // req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("cr.update error:", e);
    res.status(500).json({ error: "Error al actualizar regla" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM commission_rules WHERE id = ?`, [id]);
    // req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("cr.remove error:", e);
    res.status(500).json({ error: "Error al eliminar regla" });
  }
};

module.exports = { list, create, update, remove };
