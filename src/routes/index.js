const router = require("express").Router();

const userRoutes = require("./usuarios.routes");
const productRoutes = require("./productos.routes")

router.use("/usuarios", userRoutes);
router.use("/productos", productRoutes);

module.exports = router;