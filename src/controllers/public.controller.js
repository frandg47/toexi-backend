const pool = require("../config/db");
const { buildProductView, findBestRule } = require("../services/pricing");

const getConfig = async (req, res) => {
  try {
    const [[fx]] = await pool.query(
      "SELECT rate, source, updated_at FROM fx_rates WHERE is_active = 1 LIMIT 1"
    );
    const [methods] = await pool.query(
      "SELECT id, name, multiplier FROM payment_methods ORDER BY id"
    );
    res.json({ fx: fx || null, paymentMethods: methods });
  } catch (e) {
    console.error("getConfig error:", e);
    res.status(500).json({ error: "Error al obtener config pública" });
  }
};

const getProducts = async (req, res) => {
  try {
    const [[fx]] = await pool.query(
      "SELECT rate FROM fx_rates WHERE is_active = 1 LIMIT 1"
    );
    const fxRate = fx?.rate || 0;

    const [products] =
      await pool.query(`SELECT p.id, p.name, p.usd_price, p.image_url, p.commission_pct, p.commission_fixed,
      p.allow_backorder, p.lead_time_label, p.active,
      b.name AS brand, c.name AS category,
      p.brand_id, p.category_id,
      IFNULL(i.stock, 0) AS stock
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.active = 1
      ORDER BY c.name, b.name, p.name`); // Tu consulta actual

    const [methods] = await pool.query(
      "SELECT id, name, multiplier FROM payment_methods ORDER BY id"
    );

    // Paso 1: Obtener todas las reglas de comisión en una sola consulta
    const [commissionRules] = await pool.query(
      `SELECT brand_id, category_id, commission_pct, commission_fixed, priority
             FROM commission_rules ORDER BY priority ASC`
    );

    res.set("Cache-Control", "public, max-age=10");

    const result = [];
    for (const p of products) {
      // Paso 2: Pasar el array de reglas a una función que busque en memoria
      const rule = findBestRule(p.category_id, p.brand_id, commissionRules);
      result.push(buildProductView(p, fxRate, methods, rule));
    }
    res.json(result);
  } catch (e) {
    console.error("getProducts error:", e);
    res.status(500).json({ error: "Error al obtener productos públicos" });
  }
};

module.exports = { getConfig, getProducts };
