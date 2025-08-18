const pool = require("../../config/db");

const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    await pool.query(
      `INSERT INTO inventory (product_id, stock) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE stock = VALUES(stock), updated_at = CURRENT_TIMESTAMP`,
      [productId, Number(stock)]
    );
    // req.io?.emit("products.updated");
    res.json({ ok: true });
  } catch (e) {
    console.error("inventory.updateStock error:", e);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};

module.exports = { updateStock };
