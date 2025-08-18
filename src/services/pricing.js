const pool = require("../config/db");

/** Redondeo amable a múltiplos de 10 */
function roundARS(n) {
  return Math.round(Number(n) / 10) * 10;
}

/** Busca mejor regla de comisión (marca+categoría > marca > categoría > null) */
async function findBestRule(categoryId, brandId) {
  const [rows] = await pool.query(
    `SELECT * FROM commission_rules
     WHERE (category_id = ? OR category_id IS NULL)
       AND (brand_id = ? OR brand_id IS NULL)
     ORDER BY priority ASC
     LIMIT 1`,
    [categoryId, brandId]
  );
  return rows[0] || null;
}

function calcCommissionARS(prod, arsPrice, rule) {
  if (prod.commission_fixed != null) return Number(prod.commission_fixed);
  if (prod.commission_pct != null) return arsPrice * (Number(prod.commission_pct) / 100);
  if (rule?.commission_fixed != null) return Number(rule.commission_fixed);
  if (rule?.commission_pct != null) return arsPrice * (Number(rule.commission_pct) / 100);
  return 0;
}

/** Construye el objeto “vista producto” para vendedores */
function buildProductView(prod, fxRate, paymentMethods, rule) {
  const usd = Number(prod.usd_price);
  const arsBase = roundARS(usd * Number(fxRate));
  const pricesByMethod = paymentMethods.map(m => ({
    method: m.name,
    price: roundARS(arsBase * Number(m.multiplier))
  }));
  const commissionARS = Math.round(calcCommissionARS(prod, arsBase, rule));

  return {
    id: prod.id,
    name: prod.name,
    brand: prod.brand,
    category: prod.category,
    stock: prod.stock ?? 0,
    encargable: (prod.stock ?? 0) <= 0 && !!prod.allow_backorder,
    leadTime: (prod.stock ?? 0) <= 0 ? (prod.lead_time_label || null) : null,
    usd,
    ars: arsBase,
    pricesByMethod,
    commissionARS
  };
}

module.exports = {
  roundARS,
  findBestRule,
  buildProductView
};
