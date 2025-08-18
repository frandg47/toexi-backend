const pool = require("../../config/db");

// Listado admin (incluye inactivos)
const list = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, b.name AS brand, c.name AS category, IFNULL(i.stock,0) AS stock
       FROM products p
       LEFT JOIN brands b ON b.id=p.brand_id
       JOIN categories c ON c.id=p.category_id
       LEFT JOIN inventory i ON i.product_id=p.id
       ORDER BY c.name, b.name, p.name`
    );
    res.json(rows);
  } catch (e) {
    console.error("products.list error:", e);
    res.status(500).json({ error: "Error al listar productos" });
  }
};

const create = async (req, res) => {
  try {
    const {
      name, brand_id, category_id, usd_price,
      commission_pct = null, commission_fixed = null,
      allow_backorder = false, lead_time_label = null, active = true
    } = req.body;

    const [r] = await pool.query(
      `INSERT INTO products
       (name, brand_id, category_id, usd_price, commission_pct, commission_fixed,
        allow_backorder, lead_time_label, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, brand_id || null, category_id, usd_price, commission_pct, commission_fixed,
        !!allow_backorder, lead_time_label, !!active]
    );

    await pool.query(
      `INSERT INTO inventory (product_id, stock) VALUES (?, 0)`,
      [r.insertId]
    );

    req.io?.emit("products.updated");
    res.json({ id: r.insertId });
  } catch (e) {
    console.error("products.create error:", e);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [
      "name", "brand_id", "category_id", "usd_price",
      "commission_pct", "commission_fixed",
      "allow_backorder", "lead_time_label", "active"
    ];
    const data = fields.reduce((acc, f) => {
      if (f in req.body) acc[f] = req.body[f];
      return acc;
    }, {});
    if (!Object.keys(data).length) return res.status(400).json({ error: "Nada para actualizar" });

    // build SET dinámico
    const set = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const vals = Object.values(data);

    await pool.query(`UPDATE products SET ${set} WHERE id = ?`, [...vals, id]);
    req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("products.update error:", e);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM inventory WHERE product_id = ?`, [id]);
    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
    req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("products.remove error:", e);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};

module.exports = { list, create, update, remove };
