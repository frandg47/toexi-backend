const router = require("express").Router();
const { getConfig, getProducts } = require("../controllers/public.controller");

router.get("/config", getConfig);
router.get("/products", getProducts);

module.exports = router;
