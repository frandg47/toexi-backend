const router = require("express").Router();
const publicRoutes = require("./public.routes");
const authRoutes = require("./admin/auth.routes");
const productsRoutes = require("./admin/products.routes");
const inventoryRoutes = require("./admin/inventory.routes");
const fxRoutes = require("./admin/fx.routes");
const paymentMethodsRoutes = require("./admin/paymentMethods.routes");
const commissionRulesRoutes = require("./admin/commissionRules.routes");
const catalogsRoutes = require("./admin/catalogs.routes");
const { auth } = require("../middleware/auth");

// Público (sin login)
router.use("/public", publicRoutes);

// Admin (login/logout sin auth)
router.use("/admin", authRoutes);

// Admin protegido
router.use("/admin/products", auth, productsRoutes);
router.use("/admin/inventory", auth, inventoryRoutes);
router.use("/admin/fx", auth, fxRoutes);
router.use("/admin/payment-methods", auth, paymentMethodsRoutes);
router.use("/admin/commission-rules", auth, commissionRulesRoutes);
router.use("/admin/catalogs", catalogsRoutes);

module.exports = router;
